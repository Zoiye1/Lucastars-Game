import { DefaultGameState, GameState } from "@shared/types";
import { GameRouteService } from "./GameRouteService";

/**
 * Service to handle audio playback in the game
 */
export class AudioService {
    /** Cache for preloaded audio files */
    private _audioCache: Map<string, HTMLAudioElement> = new Map();
    private static _instance: AudioService;
    private _backgroundMusic: HTMLAudioElement;
    private _isMuted: boolean = false;
    private _roomMusicMap: Map<string, string> = new Map();
    private _currentRoom: string = "";
    private _fadeInterval?: number;
    private _stateCheckInterval?: number;
    private _isFirstPlay: boolean = true;

    /**
     * Create a new instance of the audio service or return the existing one (Singleton)
     */
    public static getInstance(): AudioService {
        // if (!AudioService._instance) {
        AudioService._instance = new AudioService();
        // }
        return AudioService._instance;
    }

    /**
     * Private constructor to enforce singleton pattern
     */
    private constructor() {
        this._backgroundMusic = new Audio();
        this._backgroundMusic.loop = true;
        this._backgroundMusic.volume = 0.5;

        this.initializeRoomMusicMap();

        this.preloadAudio();

        // Log available mappings for debugging
        console.log("Audio mappings initialized for rooms:",
            Array.from(this._roomMusicMap.keys()).join(", "));
    }

    /**
     * Preload all background music files
     */
    private preloadAudio(): void {
        this._roomMusicMap.forEach((audioPath, roomAlias) => {
            const audio: HTMLAudioElement = new Audio();
            audio.src = audioPath;
            audio.preload = "auto";
            this._audioCache.set(roomAlias, audio);

            audio.load();
        });
    }

    /**
     * Initialize the mapping between rooms and their background music
     */
    private initializeRoomMusicMap(): void {
        // Use both lowercase and original case for better matching
        this._roomMusicMap.set("starterroom", "/assets/audio/starterroom.mp3");
        this._roomMusicMap.set("cafeteria", "/assets/audio/cafetaria.mp3");
        this._roomMusicMap.set("gym", "/assets/audio/gym.mp3");
        this._roomMusicMap.set("hallway", "/assets/audio/hallway.mp3");
        this._roomMusicMap.set("labroom", "/assets/audio/lab.mp3");
        this._roomMusicMap.set("lab", "/assets/audio/lab.mp3");
        this._roomMusicMap.set("KitchenRoom", "/assets/audio/kitchen.mp3");
        this._roomMusicMap.set("kitchenroom", "/assets/audio/kitchen.mp3");
        this._roomMusicMap.set("kitchen", "/assets/audio/kitchen.mp3");
        this._roomMusicMap.set("courtyard", "/assets/audio/courtyard.mp3");
        this._roomMusicMap.set("StorageRoom", "/assets/audio/storage.mp3");
        this._roomMusicMap.set("storageroom", "/assets/audio/storage.mp3");
        this._roomMusicMap.set("storage", "/assets/audio/storage.mp3");
        this._roomMusicMap.set("roof", "/assets/audio/roof.mp3");
        this._roomMusicMap.set("stranger", "/assets/audio/strangerroom.mp3");
        this._roomMusicMap.set("strangerroom", "/assets/audio/strangerroom.mp3");
        this._roomMusicMap.set("toilet", "/assets/audio/toilet.mp3");
        this._roomMusicMap.set("courtyard-end", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("courtyardtheend", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("lab-end", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("labend", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("GymEnd", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("gymend", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("startup", "/assets/audio/titlescreen.mp3");
        this._roomMusicMap.set("startuproom", "/assets/audio/titlescreen.mp3");
        this._roomMusicMap.set("Vents", "/assets/audio/hallway.mp3");
        this._roomMusicMap.set("Vents2", "/assets/audio/hallway.mp3");
        this._roomMusicMap.set("RoofEndRoom", "/assets/audio/escaped.mp3");
    }

    /**
     * Play background music for the specified room
     * @param roomAlias The alias of the room
     */
    public playRoomMusic(roomAlias: string): void {
        if (!roomAlias) {
            console.warn("Empty room alias provided to playRoomMusic");
            return;
        }

        console.log("Attempting to play music for:", roomAlias);

        // Try the exact room alias first
        let musicFile: string | undefined = this._roomMusicMap.get(roomAlias);

        // If not found, try lowercase version
        if (!musicFile) {
            const lowerAlias: string = roomAlias.toLowerCase();
            console.log("Trying lowercase alias:", lowerAlias);
            musicFile = this._roomMusicMap.get(lowerAlias);

            // If still not found, try trimming any extra spaces
            if (!musicFile) {
                const trimmedAlias: string = lowerAlias.trim();
                if (trimmedAlias !== lowerAlias) {
                    console.log("Trying trimmed alias:", trimmedAlias);
                    musicFile = this._roomMusicMap.get(trimmedAlias);
                }
            }
        }

        // If room is the same and not the first play, don't change music
        if (roomAlias === this._currentRoom && !this._isFirstPlay) {
            return;
        }

        this._currentRoom = roomAlias;
        this._isFirstPlay = false;

        if (musicFile) {
            console.log("Playing music file:", musicFile);
            if (!this._backgroundMusic.paused) {
                this.fadeOutAndChangeTrack(musicFile);
            }
            else {
                this._backgroundMusic.src = musicFile;
                if (!this._isMuted) {
                    this._backgroundMusic.load();
                    void this._backgroundMusic.play()
                        .catch((error: unknown) => {
                            console.error("Audio playback error:", error);

                            // Add special handling for the first play
                            // This will retry after a user interaction
                            if (this._isFirstPlay) {
                                console.log("Will retry audio after user interaction");
                                document.addEventListener("click", () => {
                                    if (this._backgroundMusic.paused) {
                                        void this._backgroundMusic.play()
                                            .catch(() => console.error("Still couldn't play audio after interaction"));
                                    }
                                }, { once: true });
                            }
                        });
                }
            }
        }
        else {
            console.warn("No music found for room:", roomAlias, "Available rooms:", Array.from(this._roomMusicMap.keys()).join(", "));
            this.fadeOut();
        }
    }

    /**
     * Start polling for room state changes
     * @param gameRouteService The game route service
     */
    public startRoomStatePolling(gameRouteService: GameRouteService): void {
        // Clear existing interval if any
        if (this._stateCheckInterval) {
            clearInterval(this._stateCheckInterval);
        }

        // Check room state every second
        this._stateCheckInterval = window.setInterval(async () => {
            try {
                const state: GameState = await gameRouteService.getGameState() as DefaultGameState;

                // Check all possible room name fields
                const roomAlias: string = state.roomAlias;

                if (roomAlias) {
                    this.playRoomMusic(roomAlias);
                }
            }
            catch (error) {
                console.error("Error polling room state");
                console.error(error);
            }
        }, 1000);
    }

    /**
     * Stop polling for room state changes
     */
    public stopRoomStatePolling(): void {
        if (this._stateCheckInterval) {
            clearInterval(this._stateCheckInterval);
            this._stateCheckInterval = undefined;
        }
    }

    /**
     * Fade out the current track and then change to a new one
     * @param newTrack The path to the new track
     */
    private fadeOutAndChangeTrack(newTrack: string): void {
        if (this._fadeInterval) {
            clearInterval(this._fadeInterval);
        }

        const originalVolume: number = this._backgroundMusic.volume;

        this._fadeInterval = window.setInterval(() => {
            if (this._backgroundMusic.volume > 0.05) {
                this._backgroundMusic.volume -= 0.05;
            }
            else {
                if (this._fadeInterval) {
                    clearInterval(this._fadeInterval);
                    this._fadeInterval = undefined;
                }

                this._backgroundMusic.pause();
                this._backgroundMusic.volume = originalVolume;
                this._backgroundMusic.src = newTrack;

                if (!this._isMuted) {
                    void this._backgroundMusic.play()
                        .catch(() => console.error("Audio playback error:"));
                }
            }
        }, 50);
    }

    /**
     * Fade out and stop the current track
     */
    private fadeOut(): void {
        if (this._fadeInterval) {
            clearInterval(this._fadeInterval);
        }

        const originalVolume: number = this._backgroundMusic.volume;

        this._fadeInterval = window.setInterval(() => {
            if (this._backgroundMusic.volume > 0.05) {
                this._backgroundMusic.volume -= 0.05;
            }
            else {
                if (this._fadeInterval) {
                    clearInterval(this._fadeInterval);
                    this._fadeInterval = undefined;
                }

                this._backgroundMusic.pause();
                this._backgroundMusic.volume = originalVolume;
            }
        }, 50);
    }

    /**
     * Toggle mute state for background music
     * @returns The new mute state
     */
    public toggleMute(): boolean {
        this._isMuted = !this._isMuted;

        if (this._isMuted) {
            this.fadeOut();
        }
        else if (this._currentRoom) {
            const musicFile: string | undefined = this._roomMusicMap.get(this._currentRoom);
            if (musicFile) {
                this._backgroundMusic.src = musicFile;
                void this._backgroundMusic.play()
                    .catch(() => console.error("Audio playback error:"));
            }
        }

        return this._isMuted;
    }

    /**
     * Get the current mute state
     * @returns Whether audio is currently muted
     */
    public isMuted(): boolean {
        return this._isMuted;
    }

    /**
     * Set the volume of the background music
     * @param volume Volume level from 0.0 to 1.0
     */
    public setVolume(volume: number): void {
        const clampedVolume: number = Math.max(0, Math.min(1, volume));
        this._backgroundMusic.volume = clampedVolume;
    }

    /**
     * Force play the current room's music
     * This can be useful to trigger after user interaction
     */
    public forcePlayCurrentRoomMusic(): void {
        if (this._currentRoom && !this._isMuted) {
            const musicFile: string | undefined = this._roomMusicMap.get(this._currentRoom);
            if (musicFile) {
                this._backgroundMusic.src = musicFile;
                void this._backgroundMusic.play()
                    .catch(() => console.error("Forced audio playback error:"));
            }
        }
    }
}

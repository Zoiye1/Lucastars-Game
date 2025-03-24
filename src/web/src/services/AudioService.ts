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

    /**
     * Create a new instance of the audio service or return the existing one (Singleton)
     */
    public static getInstance(): AudioService {
        AudioService._instance = new AudioService();
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
        this._roomMusicMap.set("starterroom", "/assets/audio/starterroom.mp3");
        this._roomMusicMap.set("cafeteria", "/assets/audio/cafetaria.mp3");
        this._roomMusicMap.set("gym", "/assets/audio/gym.mp3");
        this._roomMusicMap.set("hallway", "/assets/audio/hallway.mp3");
        this._roomMusicMap.set("labroom", "/assets/audio/lab.mp3");
        this._roomMusicMap.set("KitchenRoom", "/assets/audio/kitchen.mp3");
        this._roomMusicMap.set("courtyard", "/assets/audio/courtyard.mp3");
        this._roomMusicMap.set("StorageRoom", "/assets/audio/storage.mp3");
        this._roomMusicMap.set("roof", "/assets/audio/roof.mp3");
        this._roomMusicMap.set("strangerroom", "/assets/audio/strangerroom.mp3");
        this._roomMusicMap.set("toilet", "/assets/audio/toilet.mp3");
        this._roomMusicMap.set("courtyard-end", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("lab-end", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("GymEnd", "/assets/audio/escaped.mp3");
        this._roomMusicMap.set("startup", "/assets/audio/titlescreen.mp3");
        this._roomMusicMap.set("Vents", "/assets/audio/hallway.mp3");
    }

    /**
     * Play background music for the specified room
     * @param roomAlias The alias of the room
     */
    public playRoomMusic(roomAlias: string): void {
        console.log(roomAlias);
        console.log("currentRoom", this._currentRoom);
        if (roomAlias === this._currentRoom) {
            return;
        }

        this._currentRoom = roomAlias;
        const musicFile: string | undefined = this._roomMusicMap.get(roomAlias);

        if (musicFile) {
            if (!this._backgroundMusic.paused) {
                this.fadeOutAndChangeTrack(musicFile);
            }
            else {
                this._backgroundMusic.src = musicFile;
                if (!this._isMuted) {
                    void this._backgroundMusic.play()
                        .catch(() => console.error("Audio playback error:"));
                }
            }
        }
        else {
            this.fadeOut();
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
}

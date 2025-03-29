/**
 * Utility functions for audio handling
 */

/**
 * Enable audio autoplay by adding a temporary event listener to the document.
 * This helps overcome browser restrictions that require user interaction before audio can play.
 */
export function enableAudioAutoplay(): void {
    const unlockAudio: () => void = (): void => {
        // Create a short, silent audio element
        const silentAudio: HTMLAudioElement = new Audio();
        silentAudio.src = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4LjIwLjEwMAAAAAAAAAAAAAAA//tUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABYADAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP/7UgAAABDQAU3AAAAIlAApp4AAACUBoLuUEACrPFgRcRgABoAAAABBEREREREREAAAAAAAAAABERERERERMQAAAAAAAAAARERERERERAAAAAAAAAAAAACqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqg==";
        silentAudio.volume = 0.01;

        void silentAudio.play().then(() => {
            silentAudio.pause();
            document.removeEventListener("click", unlockAudio);
            document.removeEventListener("touchstart", unlockAudio);
            console.log("Audio playback unlocked");
        }).catch((error: unknown) => {
            console.error("Could not unlock audio:", error);
        });
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);
}

/**
 * Verify audio files exist
 * @param audioFiles Map of room names to audio file paths
 * @returns Promise that resolves to an array of missing files
 */
export async function verifyAudioFiles(audioFiles: Map<string, string>): Promise<string[]> {
    const missingFiles: string[] = [];

    for (const [room, path] of audioFiles.entries()) {
        try {
            const response: Response = await fetch(path, { method: "HEAD" });
            if (!response.ok) {
                missingFiles.push(`${room}: ${path}`);
                console.warn(`Audio file missing: ${path}`);
            }
        }
        catch {
            missingFiles.push(`${room}: ${path}`);
            console.error(`Error checking audio file ${path}:`);
        }
    }

    return missingFiles;
}

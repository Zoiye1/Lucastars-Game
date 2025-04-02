import { css, htmlArray } from "../helpers/webComponents";

const styles: string = css`
body {
    font-family: Arial, sans-serif;
    background-color: #f0f0f8;
    padding: 20px;
}

.container-map {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashed-divider {
    border-top: 2px dashed #000000;
    margin: 10px 0;
}

.map-title {
    color: #000000;
    text-align: center;
    margin-bottom: 20px;
    font-size: 24px;
}

.map-container {
    position: relative;
    width: 100%;
    height: 400px;
    background-color: #f8f8ff;
    border: 2px solid #000000;
    border-radius: 8px;
    overflow: auto;
}

.map-inner {
    position: relative;
    width: 650px;
    height: 380px;
    margin: 10px auto;
}

.room {
    position: absolute;
    background-color: #88f;
    color: white;
    padding: 8px;
    border-radius: 5px;
    font-weight: bold;
    text-align: center;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    user-select: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
}

.map-button {
    position: absolute;
    top: 24%;
    right: 12%;
    z-index: 1;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    width: 50px;
    height: 50px;
}
    .map-button:hover {
    filter: brightness(0.5);
}

.map-button img {
    width: 200%;
    height: 200%;
    object-fit: contain;
}

.current-room {
    background-color: #88f;
    outline: 3px solid #4a4af0;
}

/* Improved arrow styles */
.arrow {
    position: absolute;
    background-color: #555;
    pointer-events: none;
}

.arrow-horizontal {
    height: 2px;
}

.arrow-vertical {
    width: 2px;
}

.arrow-diagonal {
    height: 2px;
    transform-origin: 0 0;
}

.arrow-head {
    position: absolute;
    width: 0;
    height: 0;
    border-style: solid;
}

.arrow-head-right {
    border-width: 5px 0 5px 8px;
    border-color: transparent transparent transparent #555;
    margin-top: -4px;
}

.arrow-head-down {
    border-width: 8px 5px 0 5px;
    border-color: #555 transparent transparent transparent;
    margin-left: -4px;
}

.arrow-head-up {
    border-width: 0 5px 8px 5px;
    border-color: transparent transparent transparent #555;
    margin-left: -4px;
}

.arrow-head-diagonal {
    border-width: 5px 0 5px 8px;
    border-color: transparent transparent transparent #555;
}


/* Curved path from kitchen to storage using SVG */
.curved-arrow {
    position: absolute;
    stroke: #555;
    stroke-width: 2px;
    fill: none;
}

dialog {
    padding: 0;
    border: none;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
    max-width: 90vw;
    max-height: 90vh;
    z-index: 1;
}

#closeMapDialog {
    position: absolute;
    top: 10px;
    right: 10px;
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #000000;
    z-index: 10;
}

/* Room positioning */
#startRoom {
    top: 40px;
    left: 60px;
    width: 100px;
    height: 50px;
}

#vent {
    top: 40px;
    left: 220px;
    width: 60px;
    height: 30px;
}

#roof {
    top: 40px;
    left: 320px;
    width: 100px;
    height: 50px;
}

#hallway {
    top: 120px;
    left: 80px;
    width: 40px;
    height: 120px;
    writing-mode: vertical-lr;
    transform: rotate(180deg);
}

#toilet {
    top: 140px;
    left: 220px;
    width: 90px;
    height: 40px;
}

#strangerRoom {
    top: 270px;
    left: 60px;
    width: 100px;
    height: 50px;
}

#cafeteria {
    top: 270px;
    left: 220px;
    width: 100px;
    height: 50px;
}

#courtyard {
    top: 340px;
    left: 220px;
    width: 100px;
    height: 40px;
}

#kitchen {
    top: 270px;
    left: 380px;
    width: 100px;
    height: 50px;
}

#gym {
    top: 340px;
    left: 380px;
    width: 100px;
    height: 40px;
}

#lab {
    top: 40px;
    left: 480px;
    width: 100px;
    height: 50px;
}

#storage {
    top: 140px;
    left: 480px;
    width: 100px;
    height: 40px;
}`;

export class MapComponent extends HTMLElement {
    public connectedCallback(): void {
        this.attachShadow({ mode: "open" });
        this.render();
    }

    private render(): void {
        if (!this.shadowRoot) {
            return;
        }
        const elements: HTMLElement[] = htmlArray`
            <style>
                ${styles}
            </style>
            <button class="map-button" id="mapButton">
                <img src="/assets/img/MapButton.png" alt="Map">
            </button>
<dialog id="mapDialog">
    <div class="container">
        <button id="closeMapDialog">✕</button>
        <div class="container-map">
            <div class="dashed-divider"></div>
            <h2 class="map-title">Hospital Map</h2>
            <div class="map-container">
                <div class="map-inner">
                    <!-- Rooms -->
                    <div class="room current-room" id="startRoom">Start Room</div>
                    <div class="room" id="vent">Vent</div>
                    <div class="room" id="roof">Roof</div>
                    <div class="room" id="hallway">Hallway</div>
                    <div class="room" id="toilet">Toilet</div>
                    <div class="room" id="strangerRoom">Stranger Room</div>
                    <div class="room" id="cafeteria">Cafeteria</div>
                    <div class="room" id="courtyard">Courtyard</div>
                    <div class="room" id="kitchen">Kitchen</div>
                    <div class="room" id="gym">Gym</div>
                    <div class="room" id="lab">Lab</div>
                    <div class="room" id="storage">Storage</div>
                    
                    <!-- Start Room to Vent -->
                    <div class="arrow arrow-horizontal" style="top: 55px; left: 160px; width: 60px;"></div>
                    <div class="arrow-head arrow-head-right" style="left: 220px; top: 55px;"></div>
                    
                    <!-- Vent to Roof -->
                    <div class="arrow arrow-horizontal" style="top: 55px; left: 280px; width: 40px;"></div>
                    <div class="arrow-head arrow-head-right" style="left: 320px; top: 55px;"></div>
                    
                    <!-- Start Room to Hallway -->
                    <div class="arrow arrow-vertical" style="top: 90px; left: 100px; height: 30px;"></div>
                    <div class="arrow-head arrow-head-down" style="left: 100px; top: 120px;"></div>
                    
                    <!-- Hallway to Toilet -->
                    <div class="arrow arrow-horizontal" style="top: 160px; left: 120px; width: 100px;"></div>
                    <div class="arrow-head arrow-head-right" style="left: 220px; top: 160px;"></div>
                    
                    <!-- Hallway to Stranger Room -->
                    <div class="arrow arrow-vertical" style="top: 240px; left: 100px; height: 30px;"></div>
                    <div class="arrow-head arrow-head-down" style="left: 100px; top: 270px;"></div>
                    
                    <!-- Hallway to Cafeteria -->
                    <div class="arrow arrow-diagonal" style="top: 180px; left: 120px; width: 100px; transform: rotate(35deg);"></div>
                    <div class="arrow-head arrow-head-diagonal" style="left: 202px; top: 235px; transform: rotate(35deg);"></div>
                    
                    <!-- Cafeteria to Kitchen -->
                    <div class="arrow arrow-horizontal" style="top: 295px; left: 320px; width: 60px;"></div>
                    <div class="arrow-head arrow-head-right" style="left: 380px; top: 295px;"></div>
                    
                    <!-- Cafeteria to Courtyard -->
                    <div class="arrow arrow-vertical" style="top: 320px; left: 270px; height: 20px;"></div>
                    <div class="arrow-head arrow-head-down" style="left: 270px; top: 340px;"></div>
                    
                    <!-- Cafeteria to Gym -->
                    <div class="arrow arrow-diagonal" style="top: 320px; left: 320px; width: 60px; transform: rotate(30deg);"></div>
                    <div class="arrow-head arrow-head-diagonal" style="left: 369px; top: 345px; transform: rotate(30deg);"></div>
                    
                    <!-- Storage to Lab -->
                    <div class="arrow arrow-vertical" style="top: 90px; left: 530px; height: 50px;"></div>
                    <div class="arrow-head arrow-head-up" style="left: 530px; top: 90px;"></div>
                    
                    
                    <!-- Kitchen to Storage (Curved Path using SVG) - Fixed to point to Storage instead of Lab -->
                    <svg width="200" height="200" style="position: absolute; top: 190px; left: 430px; overflow: visible;">
                      <path d="M 40,80 C 40,50 80,40 90,0" class="curved-arrow" />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</dialog>
        `;

        while (this.shadowRoot.firstChild) {
            this.shadowRoot.firstChild.remove();
        }
        this.shadowRoot.append(...elements);

        const button: HTMLButtonElement = this.shadowRoot.querySelector("#mapButton") as HTMLButtonElement;
        const dialog: HTMLDialogElement = this.shadowRoot.querySelector("#mapDialog") as HTMLDialogElement;
        const closeBtn: HTMLButtonElement = this.shadowRoot.querySelector("#closeMapDialog") as HTMLButtonElement;
        console.log(button);

        button.addEventListener("click", () => {
            dialog.showModal();
        });
        closeBtn.addEventListener("click", () => dialog.close());

        // sluit modaal als gebruiker buiten modaal klikt
        dialog.addEventListener("click", event => {
            const dialogContent: HTMLDivElement = dialog.querySelector(".container")!;
            if (!dialogContent.contains(event.target as Node)) {
                dialog.close();
            }
        });
    }
}

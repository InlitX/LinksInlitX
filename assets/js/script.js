/**
 * Script principal para la simulación de terminal y manejo de la interfaz
 * @description Este script maneja la simulación de la terminal, la obtención de información del sistema,
 *              y la interacción con el usuario.
 */

document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    var terminalContainer = document.getElementById('terminal');
    var terminalText = document.getElementById('terminal-text');
    var videoBackground = document.getElementById('myVideo');
    var audioBackground = document.getElementById('myAudio');
    var blurredBox = document.getElementById('blurred-box');
    var closeButton = document.getElementById('close-button');

    // Contenido de la terminal
    var terminalTextContent = [
        "Usuario: Unknown",
        "IP: Cargando...",
        "Sistema: Cargando...",
        "Bio cargada..",
    ];
    var currentIndex = 0;

    // Pausar video y audio al inicio
    videoBackground.pause();
    audioBackground.pause();

    /**
     * Función para simular la escritura en la terminal
     */
    function typeWriter() {
        var line = currentIndex === 0 ? getAsciiArt() : terminalTextContent[currentIndex - 1];
        var i = 0;

        function typeChar() {
            if (i < line.length) {
                if (currentIndex === 0) {
                    var span = document.createElement('span');
                    span.textContent = line.charAt(i);
                    terminalText.appendChild(span);
                } else {
                    terminalText.textContent += line.charAt(i);
                }
                i++;
                setTimeout(typeChar, 30);
            } else {
                terminalText.textContent += "\n";
                currentIndex++;
                if (currentIndex < terminalTextContent.length + 1) {
                    typeWriter();
                } else {
                    
                    setTimeout(() => {
                        simulateEnterPress();
                        audioBackground.play();
                    }, 2000);
                }
            }
        }

        typeChar();
    }

    /**
     * Función para manejar la entrada del usuario
     */
    function handleInput() {
        terminalContainer.style.display = 'none';
        videoBackground.play();
        audioBackground.play();
        blurredBox.style.display = 'block';
        console.log("Simulación completada");
    }

    /**
     * Función para simular la presión de la tecla Enter
     */
    function simulateEnterPress() {
        var event = new KeyboardEvent('keydown', {
            key: 'Enter',
            keyCode: 13,
            code: 'Enter',
            which: 13,
            bubbles: true,
        });
        document.dispatchEvent(event);
    }

    /**
     * Función para manejar la presión de teclas
     * @param {KeyboardEvent} event - Evento de teclado
     */
    function handleKeyPress(event) {
        if (event.key === 'Enter') {
            handleInput();
        }
    }

    // Obtener la dirección IP del usuario
    fetch('https://api.ipify.org?format=json')
        .then(response => response.json())
        .then(data => {
            var ipAddress = data.ip;
            terminalTextContent[1] = "IP: " + ipAddress;
            typeWriter();
        })
        .catch(error => {
            console.error('Error obteniendo dirección IP:', error);
            terminalTextContent[1] = "IP: 127.0.0.1";
            typeWriter();
        });

    var userAgent = navigator.userAgent;

    /**
     * Función para obtener el sistema operativo del usuario
     * @returns {string} - Nombre del sistema operativo
     */
    function getOperatingSystem() {
        if (userAgent.match(/Windows/)) {
            return getWindowsVersion();
        } else if (userAgent.match(/Macintosh/)) {
            return getMacOSVersion();
        } else if (userAgent.match(/Linux/)) {
            return "Linux";
        } else if (userAgent.match(/Android/)) {
            return getAndroidVersion();
        } else if (userAgent.match(/iPhone|iPad|iPod/)) {
            return getiOSVersion();
        } else {
            return "Desconocido";
        }
    }

    /**
     * Función para obtener la versión de Windows
     * @returns {string} - Versión de Windows
     */
    function getWindowsVersion() {
        var version = userAgent.match(/Windows NT ([\d.]+)/);
        if (version) {
            version = version[1];
            switch (version) {
                case "5.1":
                    return "Windows XP";
                case "6.0":
                    return "Windows Vista";
                case "6.1":
                    return "Windows 7";
                case "6.2":
                    return "Windows 8";
                case "6.3":
                    return "Windows 8.1";
                case "10.0":
                    return "Windows 10";
                case "11.0":
                    return "Windows 11";
                default:
                    return "Windows";
            }
        } else {
            return "Windows";
        }
    }

    /**
     * Función para obtener la versión de macOS
     * @returns {string} - Versión de macOS
     */
    function getMacOSVersion() {
        var version = userAgent.match(/Mac OS X ([\d_]+)/);
        if (version) {
            version = version[1].replace(/_/g, '.');
            return "macOS " + version;
        } else {
            return "macOS";
        }
    }

    /**
     * Función para obtener la versión de Android
     * @returns {string} - Versión de Android
     */
    function getAndroidVersion() {
        var version = userAgent.match(/Android ([\d.]+)/);
        if (version) {
            return "Android " + version[1];
        } else {
            return "Android";
        }
    }

    /**
     * Función para obtener la versión de iOS
     * @returns {string} - Versión de iOS
     */
    function getiOSVersion() {
        var version = userAgent.match(/OS ([\d_]+)/);
        if (version) {
            version = version[1].replace(/_/g, '.');
            return "iOS " + version;
        } else {
            return "iOS";
        }
    }

    var operatingSystem = getOperatingSystem();
    terminalTextContent[2] = "Sistema: " + operatingSystem;

    /**
     * Función para centrar la terminal en la pantalla
     */
    function centerTerminal() {
        var terminalWidth = terminalContainer.offsetWidth;
        var terminalHeight = terminalContainer.offsetHeight;
        var centerX = (window.innerWidth - terminalWidth) / 2;
        var centerY = (window.innerHeight - terminalHeight) / 2;

        terminalContainer.style.left = centerX + 'px';
        terminalContainer.style.top = centerY + 'px';
    }

    // Centrar la terminal y ajustar al redimensionar la ventana
    centerTerminal();
    window.addEventListener('resize', centerTerminal);

    // Estilos para el texto de la terminal
    terminalText.style.textAlign = 'center';
    terminalText.style.whiteSpace = 'pre';

    /**
     * Función para obtener el arte ASCII
     * @returns {string} - Arte ASCII
     */
    function getAsciiArt() {
        return `

             ██╗ █████╗ 
   ███═╗    ███║██╔══██╗
 ███████    ╚██║╚█████╔╝
 ╚═███═╝     ██║██╔══██╗
   ╚═╝       ██║╚█████╔╝
             ╚═╝ ╚════╝ 
               
        `;
    }

    // Control de volumen del audio
    var audio = document.getElementById("myAudio");
    var maxVolume = 0.1;

    /**
     * Función para limitar el volumen del audio
     * @param {number} volume - Volumen deseado
     */
    function limitVolume(volume) {
        if (volume > maxVolume) {
            audio.volume = maxVolume;
        } else {
            audio.volume = volume;
        }
    }

    limitVolume(0.1);

    /**
     * Función para cambiar el título de la página
     * @description Esta función cambia el título de la página para crear un efecto de escritura
     */
    function changeTitle() {
        var titles = [
            "@",
            "@I",
            "@In",
            "@Inl",
            "@Inli",
            "@Inlit",
            "@InlitX",
            "@InlitX"
        ];
        var index = 0;

        setInterval(function() {
            document.title = titles[index];
            index = (index + 1) % titles.length;
        }, 1000);
    }

    // Iniciar el cambio de título
    changeTitle();

    // Event listener para manejar la presión de teclas
    document.addEventListener('keydown', handleKeyPress);
});

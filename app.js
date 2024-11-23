if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered with scope:', registration.scope);
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}
boolean = false;
function MuzZmena(){
    document.getElementById("hlava").innerText = "👨‍🦰";
    boolean = true
}

function ZenaZmena(){
    document.getElementById("hlava").innerText = "👩";
    boolean = false
}

function StartZmena(){
    if (boolean == false){
        console.log("Vybral jsi ženu");
        document.getElementById("prvni").className = "druha_strana";
        document.getElementById("druhy").className = "prvni_strana";
        document.getElementById("hlava2").innerText = "👩";
    }
    else{
        console.log("Vybral jsi muže");
        document.getElementById("prvni").className = "druha_strana";
        document.getElementById("druhy").className = "prvni_strana";
        document.getElementById("hlava2").innerText = "👨‍🦰";
    }
    
    
}
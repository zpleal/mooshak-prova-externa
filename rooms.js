const DATA_URL = "salas_feup_ips.txt";

let openIPs = [];

window.onload = () => {

    fetch(DATA_URL)
        .then(r => r.text())
        .then(readIn)
        .then(populate)
        .catch(console.log);

    document.getElementById('update').onclick = () => {
        console.log(openIPs);
        gateKeeper(openIPs);
    };
}

async function readIn(data) {
    const roomIPs = {};

    let isFirst = true;

    data.split('\n').forEach((row) => {
        const [ room, computer, ip] = row.split('\t');

        if(isFirst) {
            isFirst = false;
        } else if(room && computer && ip) {
            if(! (room in roomIPs) )
                roomIPs[room] = [];

            roomIPs[room].push(ip);
        }
    });

    return roomIPs;
}

async function populate(roomIPs) {
    const roomsContainer = document.getElementById("roomsContainer");
    const columnSize = Math.floor(Object.keys(roomIPs).length / 3) + 1;
    let column;
    let count = 0;


    openIPs = [];
    for(const room in roomIPs) {
        if ( count++ % (columnSize) == 0) {
            column = document.createElement("div");
            column.className = 'column';
            roomsContainer.appendChild(column);
        }

        const div      = document.createElement("div");
        const checkbox = document.createElement("input");
        const label    = document.createElement("label");
        
        div.className  = 'room';

        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("id",room);
        checkbox.setAttribute("value",room);
        label.setAttribute("for",room);
        label.innerText = room;

        div.appendChild(checkbox);
        div.appendChild(label);
        column.appendChild(div);

        checkbox.onchange = () => {
            if(checkbox.checked) {
                console.log({room, status: "checked" });
                openIPs.push(room);
            }  else {
                console.log({room, status: "unchecked" });
                openIPs = openIPs.filter( v => v != room);
            }
                
        };
    }
}

function gateKeeper(ips) {
    fetch("gatekeeper",{ 
        method: "POST", 
        body: JSON.stringify(ips)   })
        .then(r => r.json())
        .then(showRoomStatus)
        .catch(console.log); 
}

function showRoomStatus(openIPs) {
    
}
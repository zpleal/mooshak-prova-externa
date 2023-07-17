const DATA_URL     = 'salas_feup_ips.txt';
const GATEKEEPER   = 'gatekeeper.cgi';

let openIPs = new Set();
let allRoomIPs;

window.onload = () => {

    fetch(DATA_URL)
        .then(r => r.text())
        .then(readIn)
        .then(populate)
        .catch(console.log);

    document.getElementById('update').onclick = () => gateKeeper( getOpenIPs() );
}

async function readIn(data) {
    const roomIPs = {};

    let count = 0;

    data.split('\n').forEach((row) => {
        const [ room, computer, ip] = row.split('\t');

        if(++count === 1) {
            // ignore first line
        } else if(room && computer && ip) {
            if(! (room in roomIPs) )
                roomIPs[room] = [];

            roomIPs[room].push(ip);
        } else if(row.trim() === "" || row.trim().startsWith('#')) {
            // ignore empty lines or those starting with # 
        } else
            console.log(`invalid line ${count}: "${row}" (use \\t as separators)`);
    });

    return roomIPs;
}

async function populate(roomIPs) {
    const roomsContainer = document.getElementById("roomsContainer");
    const columnSize = Math.floor(Object.keys(roomIPs).length / 3) + 1;
    let column;
    let count = 0;

    allRoomIPs = roomIPs;

    openIPs.clear();
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
                roomIPs[room].forEach( (ip) => openIPs.add(ip));
                
            }  else {
                console.log({room, status: "unchecked" });
                roomIPs[room].forEach( (ip) => openIPs.delete(ip));
            }
                
        };
    }

    gateKeeper(null);

}



function showAddress(_address,roomIPs) {
    const address = _address.trim();
    const status = document.getElementById('status');
    let myRoom;

    for(const room in allRoomIPs)
        for(const ip of allRoomIPs[room])
            if(ip == address)
                myRoom = room;

   document.getElementById(myRoom).parentNode.className += " current";
}

function getOpenIPs() {
    const ips = [];
    for(const ip of openIPs)
        ips.push(ip);

   return ips;
}

function gateKeeper(payload) {

    fetch(GATEKEEPER,{ 
        method: "POST", 
        body: JSON.stringify(payload) })
        .then(r => r.json())
        .then(showRooms)
        .catch(console.log); 
}

function addRoomClass(room,clazz) {
    document.getElementById(room).parentNode.classList.add(clazz);
}

function showRooms(rooms) {
    const statusDiv = document.getElementById('status');
    let myRoom;

    if(rooms.ips)
        for(const room in allRoomIPs) {
            const input = document.getElementById(room);
            let count = 0;

            input.parentNode.className = 'room';
            for(const ip of allRoomIPs[room]) {
                if(ip == rooms.address)
                    myRoom = room;
                if(rooms.ips.includes(ip))
                    count++;
            }
            if(count > 0) {
                input.checked = true;
 
                addRoomClass(room, count == allRoomIPs[room].length ? "all" : "some");
            }

        }

    if(myRoom)
        addRoomClass(myRoom,"current");


    statusDiv.innerHTML = rooms.error ?? `address: ${rooms.address}`;
    statusDiv.className = "error" in rooms ? "KO" : "OK";

    setTimeout( () => statusDiv.innerHTML = "&nbsp;", 15*1000);
}
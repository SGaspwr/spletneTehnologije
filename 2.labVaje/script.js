"use strict";

function domRemoveParticipant(event) {
    const td = event.target; 
    const tr = td.parentElement; 
    const cellText = td.innerText;

    const confirmation = confirm(`Are you sure you want to delete "${cellText}"?`);
    
    if (confirmation) {
        tr.remove();
        updateLocalStorage();
    }
}

function domAddParticipant(participant) {
    const table = document.querySelector("#participant-table");
    const tr = document.createElement("tr");
    tr.ondblclick = domRemoveParticipant;
    table.appendChild(tr);

    for (let attr in participant) {
        const td = document.createElement("td");
        td.innerText = participant[attr];
        tr.appendChild(td);
    }
    
    updateLocalStorage();
}

function addParticipant(event) {
    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const role = document.getElementById("role").value;
    
    document.getElementById("first").value = "";
    document.getElementById("last").value = "";
    
    const participant = { first, last, role };
    console.log(participant);

    domAddParticipant(participant);
    document.getElementById("first").focus();
}

function updateLocalStorage() {
    const participants = [];
    document.querySelectorAll("#participant-table tr").forEach(tr => {
        const tds = tr.querySelectorAll("td");
        if (tds.length === 3) {
            participants.push({
                first: tds[0].innerText,
                last: tds[1].innerText,
                role: tds[2].innerText
            });
        }
    });
    localStorage.setItem("participants", JSON.stringify(participants));
}

function loadParticipants() {
    const storedParticipants = JSON.parse(localStorage.getItem("participants")) || [];
    storedParticipants.forEach(domAddParticipant);
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addButton").onclick = addParticipant;
    loadParticipants();
});
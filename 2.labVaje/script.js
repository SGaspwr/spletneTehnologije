"use strict";

function domRemoveParticipant(event) {
    const td = event.target; 
    const tr = td.parentElement; 
    const cellText = td.innerText;

    const confirmation = confirm(`Are you sure you want to delete "${cellText}"?`);

    if (confirmation) {
        tr.remove(); 
    }
}

function domAddParticipant(participant) {
    const table = document.querySelector("#participant-table")
    const tr = document.createElement("tr")
    tr.ondblclick = domRemoveParticipant
    table.appendChild(tr)

    for (let attr in participant) {
        const td = document.createElement("td")
        td.innerText = participant[attr]
        tr.appendChild(td)
    }
}

function addParticipant(event) {
    const first = document.getElementById("first").value;
    const last = document.getElementById("last").value;
    const role = document.getElementById("role").value;
    
    document.getElementById("first").value = "";
    document.getElementById("last").value = "";

    
    const participant = {
        first: first,
        last: last,
        role: role
    };
    console.log(participant);

    domAddParticipant(participant);

    document.getElementById("first").focus();
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("addButton").onclick = addParticipant;
})


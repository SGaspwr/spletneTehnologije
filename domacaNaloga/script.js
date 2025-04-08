
"use strict";

function shraniDogodke() {   // Shrani dogodke v localStorage, tako kot smo delal na vajah
  const dogodki = [];
  document.querySelectorAll(".day").forEach(dan => { 
    const datum = dan.getAttribute("data-datum");   //Dobi datum za usak dan v koledarju
    dan.querySelectorAll(".dogodek").forEach(div => {   // Za vsak dogodek v dnevu
      dogodki.push({   // Shrani ta dogodek v nek objekt
        datum: datum,  
        naslov: div.textContent.trim()  
      });
    });
  });

  localStorage.setItem("koledarDogodki", JSON.stringify(dogodki));  // Shrani dogodke v localStorage
}

function naloziDogodke() {
  const dogodki = JSON.parse(localStorage.getItem("koledarDogodki")) || [];  // Naloži dogodke iz localStorage

  dogodki.forEach(d => {  // Za vsak dogodek
    const celica = document.querySelector(`.day[data-datum="${d.datum}"]`);  // Pridobi celico z datumom
    if (celica) {  // Če celica obstaja
      const dogodek = document.createElement("div"); 
      dogodek.classList.add("dogodek"); 
      dogodek.setAttribute("id", `event-${d.datum}-${d.naslov}`); // Dodeli ID dogodku
      dogodek.setAttribute("draggable", "true"); // Omogočimo drag

      dogodek.innerHTML = `<strong>${d.naslov}</strong>`; 
      celica.appendChild(dogodek);  

      // Omogočimo interakcije za premikanje
      dogodek.addEventListener("dragstart", dragstartHandler);
    }
  });

  omogociDogodke(); // omogoči dvojni klik za brisanje/urejanje
}

document.getElementById("dogodek-form").addEventListener("submit", function (e) {
  e.preventDefault();

  const datum = document.getElementById("datum").value; // Uzamemo datum iz celice
  const naslov = document.getElementById("naslov").value; // Uzamemo naslov iz celice
  const opis = document.getElementById("opis").value; // Uzamemo opis iz celice

  const celica = document.querySelector(`.day[data-datum="${datum}"]`); // Pridobi celico z datumom

  if (celica) {
    const dogodek = document.createElement("div");
    dogodek.classList.add("dogodek");
    dogodek.setAttribute("id", `event-${datum}-${naslov}`);
    dogodek.setAttribute("draggable", "true");

    dogodek.innerHTML = `<strong>${naslov}</strong>`;
    
    // Shrani opis dogodka kot atribut
    dogodek.setAttribute("data-opis", opis);

    celica.appendChild(dogodek);

    shraniDogodke();

    dogodek.addEventListener("dragstart", dragstartHandler);

    // Dodamo obdelovalec za dvojni klik
    dogodek.addEventListener("dblclick", function() {
      const dogodekOpis = dogodek.getAttribute("data-opis");
      const novOpis = prompt("Uredi opis dogodka:", dogodekOpis);
      
      // Če uporabnik spremeni opis, posodobimo atribut
      if (novOpis !== null) {
        dogodek.setAttribute("data-opis", novOpis);
      }
    });

    omogociDogodke();
  } else {
    alert("Ta datum ni v aprilu!");
  }

  this.reset();
});


function omogociDogodke() {
  document.querySelectorAll(".dogodek").forEach(dogodek => {  
    // Odstrani vse listenerje da ni podvajanja
    dogodek.removeEventListener("dblclick", dblclickHandler);

    // Dodaj nov listener 
    dogodek.addEventListener("dblclick", dblclickHandler);
  });
}

function dblclickHandler() {
  const td = this;
  const cellText = td.querySelector("strong").textContent.trim();
  const opisElementa = td.querySelector(".opis") ? td.querySelector(".opis").textContent.trim() : '';

  // prompt pac k double kliknes na dogodek
  const akcija = prompt(`Vpisite novo ime za "${cellText}" ali kliknite Preklici za preklic. Pusti prazno za brisanje:`);

  if (akcija === null) return;

  if (akcija.trim() === "") {
    const confirmation = confirm(`Ali ste prepričani, da želite izbrisati "${cellText}"?`);
    if (confirmation) {
      td.remove();
      shraniDogodke();
    }
  } else {
      td.innerHTML = `<strong>${akcija}</strong>`; 
      shraniDogodke();  
    }
  }


function dragstartHandler(ev) {
  // Shrani ID dogodka, ki ga premikamo
  ev.dataTransfer.setData("text", ev.target.id);
}

function dragoverHandler(ev) {  // Omogoči spust dogodka
  ev.preventDefault();
}

function dropHandler(ev) {  // Ob spustu dogodka
  ev.preventDefault();  
  const data = ev.dataTransfer.getData("text");   // Pridobi ID dogodka
  const targetDay = ev.target.closest(".day");   // Pridobi ciljno celico

  if (targetDay) {
    const dogodek = document.getElementById(data);  
    targetDay.appendChild(dogodek);  // Dodaj dogodek v ciljno celico

    const noviDatum = targetDay.getAttribute("data-datum");  // Pridobi nov datum
    dogodek.setAttribute("data-datum", noviDatum);  // Nastavi nov datum dogodka

    shraniDogodke(); 
  }
}

document.querySelectorAll(".day").forEach(celica => {   
  celica.addEventListener("dragover", dragoverHandler);   

  celica.addEventListener("drop", dropHandler);   
});

function osveziCas() {
  const zdaj = new Date();
  const cas = zdaj.toLocaleTimeString("sl-SI", { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const datum = zdaj.toLocaleDateString("sl-SI", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  document.getElementById("trenutni-cas").textContent = cas;
  document.getElementById("trenutni-datum").textContent = datum;

  const danes = zdaj.getDate();

  document.querySelectorAll(".day").forEach(el => {
    const day = parseInt(el.getAttribute("data-datum").split("-")[2]);
    const dateNumber = el.querySelector(".date-number");
    if (day === danes) {
      dateNumber.classList.add("today");
    } else {
      dateNumber.classList.remove("today");
    }
  });
}


document.addEventListener("DOMContentLoaded", function() {
  // Ob začetku naložimo dogodke iz localStorage ker ce shranm v teden.html se prkaze se na index.html
  naloziDogodke();
});


setInterval(osveziCas, 1000);
osveziCas();
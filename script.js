
    /* ======================================================
       Variables & Fonctions communes
    ====================================================== */
    // On stocke séparément le total Déchets et le total Énergie
    let totalDechetCO2 = 0;
    let totalEnergieCO2 = 0;
    let totalCO2=0;

    // Mettre à jour l'affichage du bilan global
    function updateBilanGlobal() {

      console.log("Mise à jour bilan global : ", totalDechetCO2, totalEnergieCO2); // 🔍 Debug

      document.getElementById("dechetValue").innerText = totalDechetCO2.toFixed(2);
      document.getElementById("energieValue").innerText = totalEnergieCO2.toFixed(2);
      document.getElementById("BDEValue").innerText = totalCO2.toFixed(2);
      document.getElementById("bilanGlobalValue").innerText = (totalDechetCO2 + totalEnergieCO2).toFixed(2);

      
    // Afficher un camembert Bilan (Déchets vs. Énergie)
  displayCarbonChartFusion(totalDechetCO2, totalEnergieCO2,totalCO2);
      
    }

     /* ======================================================
       Onglets
    ====================================================== */
    function openTab(evt, tabName) {
      // Masquer tous les onglets
      const contents = document.querySelectorAll(".tab-content");
      contents.forEach(c => c.style.display = "none");

      // Enlever la classe active de tous les boutons
      const buttons = document.querySelectorAll(".tab-button");
      buttons.forEach(b => b.classList.remove("active"));

      // Afficher le contenu sélectionné
      document.getElementById(tabName).style.display = "block";
      evt.currentTarget.classList.add("active");

      // Si on va sur "Bilan total", on met à jour l'affichage
      if (tabName === "tab-bilan") {
        updateBilanGlobal();
      }
    }

    // Ouvrir le dernier onglet bilan total par défaut
    document.querySelectorAll(".tab-button")[0].click();


  
    function displayCarbonChartFusion(dechet, energie,bde) {
  const ctx = document.getElementById('carbonChartFusion').getContext('2d');
  
  // Vérifiez si un graphique existe déjà sur le canvas et détruisez-le
  if (window.myChart) {
    window.myChart.destroy();
  }

  // Créez un nouveau graphique
  window.myChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: [
        "Déchets",
        "Energie",
        "BDE"
      ],
      datasets: [{
        label: 'Émissions totales de CO2 (kg CO₂e)',
        data: [
          dechet.toFixed(2),
          energie.toFixed(2),
          bde.toFixed(2)
        ],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(23,54,180,0.6)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true
    }
  });
}


  

    // Exporter le bilan global
    function exportToExcelFusion() {
      if ((totalDechetCO2 + totalEnergieCO2 + totalCO2) <= 0) {
        alert("Aucun calcul effectué pour le bilan global.");
        return;
      }

      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const worksheetData = [
        ["Bilan Carbone Global (kg CO₂e)", "Déchets (kg CO₂e)", "Énergie (kg CO₂e)", "BDE", "Date"],
        [(totalDechetCO2 + totalEnergieCO2).toFixed(2), totalDechetCO2, totalEnergieCO2, totalCO2, formattedDate]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Bilan Global");

      const fileName = `BilanGlobal_${formattedDate}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }




    /* ======================================================
       Code pour la partie "Déchets"
    ====================================================== */
    // Données fictives pour les émissions de CO2 (en kgCO2 par kg de déchet)
    const emissionsCO2Dechets = {
      carton: 0.3,
      plastique: 6.0,
      verre: 0.2,
      bois: 0.1,
      ordures: 1.0,
      dechetsVerts: 0.1,
      deee: 5.0,
      piles: 0.5,
      metaux: 2.0,
      eauxUsees: 0.1
    };

    let emissionDechets = 0;
    let emissionMenagers = 0;
    let emissionAutre = 0;
    let totalEauxUsees = 0;

    function ajouterDechet() {
      const typeDechet = document.getElementById("dechet").value;
      const quantite = parseFloat(document.getElementById("quantite").value);
      if (isNaN(quantite) || quantite <= 0) {
        alert("Veuillez entrer une quantité valide");
        return;
      }
      const li = document.createElement("li");
      li.textContent = `${quantite} kg de ${typeDechet}`;
      document.getElementById("listeDechets").appendChild(li);
      emissionDechets += (emissionsCO2Dechets[typeDechet] || 0) * quantite;
    }

    function ajouterDechetMenager() {
      const typeDechet = document.getElementById("dechetMenager").value;
      const quantite = parseFloat(document.getElementById("quantiteMenager").value);
      if (isNaN(quantite) || quantite <= 0) {
        alert("Veuillez entrer une quantité valide");
        return;
      }
      const li = document.createElement("li");
      li.textContent = `${quantite} kg de ${typeDechet}`;
      document.getElementById("listeDechetsMenagers").appendChild(li);
      emissionMenagers += (emissionsCO2Dechets[typeDechet] || 0) * quantite;
    }

    function ajouterDechetAutre() {
      const typeDechet = document.getElementById("dechetAutre").value;
      const quantite = parseFloat(document.getElementById("quantiteAutre").value);
      if (isNaN(quantite) || quantite <= 0) {
        alert("Veuillez entrer une quantité valide");
        return;
      }
      const li = document.createElement("li");
      li.textContent = `${quantite} kg de ${typeDechet}`;
      document.getElementById("listeAutresDechets").appendChild(li);
      emissionAutre += (emissionsCO2Dechets[typeDechet] || 0) * quantite;
    }

    function calculerEmissionsDechets() {
      const volumeEaux = parseFloat(document.getElementById("volumeEaux").value) || 0;
      if (volumeEaux < 0) {
        alert("Veuillez entrer une quantité d'eau valide");
        return;
      }
      totalEauxUsees = volumeEaux * 0.1;

      // Bilan
      totalDechetCO2 = emissionDechets + emissionMenagers + emissionAutre + totalEauxUsees;

      // Afficher résultat
      document.getElementById("resultatCO2").textContent = `Total des émissions : ${totalDechetCO2.toFixed(2)} kg CO₂e`;
      displayCarbonChartDechets(emissionDechets, emissionMenagers, emissionAutre, totalEauxUsees);

      document.getElementById("form-section-dechets").style.display = "none";
      document.getElementById("result-section-dechets").style.display = "block";
      console.log("updateBilanGlobal a bien été appelée !");

    }

    function displayCarbonChartDechets(eDechets, eMenagers, eAutre, eEaux) {
      const ctx = document.getElementById('carbonChartDechets').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            'Déchets Emballages',
            'Déchets Ménagers',
            'Autres Déchets',
            'Eaux Usées'
          ],
          datasets: [{
            label: 'Émissions de CO2 (kg CO₂e)',
            data: [
              eDechets.toFixed(2),
              eMenagers.toFixed(2),
              eAutre.toFixed(2),
              eEaux.toFixed(2)
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(201, 255, 102, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderWidth: 1
          }]
        },
        options: { responsive: true }
      });
    }

    function exportToExcelDechets() {
      if (totalDechetCO2 <= 0) {
        alert("Veuillez effectuer un calcul avant d'exporter.");
        return;
      }
      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const worksheetData = [
        ["Bilan Carbone Déchets (kg CO₂e)", "Déchets Emballages", "Ménagers", "Autres Déchets", "Eaux Usées", "Date"],
        [totalDechetCO2, emissionDechets, emissionMenagers, emissionAutre, totalEauxUsees, formattedDate]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Déchets");
      const fileName = `Bilan_Carbone_Dechets_${formattedDate}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }

    function goBackDechets() {
      document.getElementById("form-section-dechets").style.display = "block";
      document.getElementById("result-section-dechets").style.display = "none";
    }

    function resetDechets() {
      document.getElementById("formulaire").reset();
      emissionDechets = 0;
      emissionMenagers = 0;
      emissionAutre = 0;
      totalEauxUsees = 0;
      totalDechetCO2 = 0;
      document.getElementById("listeDechets").innerHTML = '';
      document.getElementById("listeDechetsMenagers").innerHTML = '';
      document.getElementById("listeAutresDechets").innerHTML = '';
      document.getElementById("result-section-dechets").style.display = 'none';
      document.getElementById("form-section-dechets").style.display = 'block';
    }


    /* ======================================================
       Code pour la partie "Énergie"
    ====================================================== */
    const emissionsCO2Energie = {
      electricite: 0.3,
      gaz: 6.0,
      vapeur: {
        belley: 0.2,
        autre_reseau: 0.25
      },
      froid: {
        testfroid: 0.1,
        autre_froid: 0.15
      }
    };

    let emissionElectricite = 0;
    let emissionGaz = 0;
    let emissionVapeur = 0;
    let emissionFroid = 0;

    function calculerEmissionsEnergie() {
      const electricite = parseFloat(document.getElementById('electricite').value) || 0;
      const gaz = parseFloat(document.getElementById('gaz').value) || 0;
      const vapeur = parseFloat(document.getElementById('vapeur').value) || 0;
      const froid = parseFloat(document.getElementById('froid').value) || 0;
      const vapeurType = document.getElementById('vapeurType').value;
      const froidType = document.getElementById('froidType').value;

      // Vérification
      if (electricite < 0 || gaz < 0 || vapeur < 0 || froid < 0) {
        alert("Entrez des valeurs positives");
        return;
      }

      // Calcul
      emissionElectricite = electricite * emissionsCO2Energie.electricite;
      emissionGaz = gaz * emissionsCO2Energie.gaz;

      if (vapeur > 0 && vapeurType in emissionsCO2Energie.vapeur) {
        emissionVapeur = vapeur * emissionsCO2Energie.vapeur[vapeurType];
      } else {
        emissionVapeur = 0;
      }

      if (froid > 0 && froidType in emissionsCO2Energie.froid) {
        emissionFroid = froid * emissionsCO2Energie.froid[froidType];
      } else {
        emissionFroid = 0;
      }

      totalEnergieCO2 = emissionElectricite + emissionGaz + emissionVapeur + emissionFroid;

      // Affichage
      document.getElementById('result-energie').innerHTML = `
        <p>Les émissions totales sont de <strong>${totalEnergieCO2.toFixed(2)} kg CO₂e</strong>.</p>
        <p>Électricité : <strong>${emissionElectricite.toFixed(2)} kg CO₂e</strong></p>
        <p>Gaz : <strong>${emissionGaz.toFixed(2)} kg CO₂e</strong></p>
        <p>Vapeur : <strong>${emissionVapeur.toFixed(2)} kg CO₂e</strong></p>
        <p>Froid : <strong>${emissionFroid.toFixed(2)} kg CO₂e</strong></p>
      `;

      displayCarbonChartEnergie(emissionElectricite, emissionGaz, emissionVapeur, emissionFroid);

      document.getElementById("form-section-energie").style.display = "none";
      document.getElementById("result-section-energie").style.display = "block";
      console.log("updateBilanGlobal a bien été appelée !");

    }

    function displayCarbonChartEnergie(eElec, eGaz, eVapeur, eFroid) {
      const ctx = document.getElementById('carbonChartEnergie').getContext('2d');
      new Chart(ctx, {
        type: 'pie',
        data: {
          labels: [
            "Électricité",
            "Gaz",
            "Vapeur",
            "Froid"
          ],
          datasets: [{
            label: 'Émissions de CO2 (kg CO₂e)',
            data: [
              eElec.toFixed(2),
              eGaz.toFixed(2),
              eVapeur.toFixed(2),
              eFroid.toFixed(2)
            ],
            backgroundColor: [
              'rgba(75, 192, 192, 0.6)',
              'rgba(255, 99, 132, 0.6)',
              'rgba(201, 255, 102, 0.6)',
              'rgba(255, 159, 64, 0.6)'
            ],
            borderWidth: 1
          }]
        },
        options: {
          responsive: true
        }
      });
    }

    function exportToExcelEnergie() {
      if (totalEnergieCO2 <= 0) {
        alert("Veuillez effectuer un calcul avant d'exporter les résultats.");
        return;
      }

      const currentDate = new Date();
      const day = currentDate.getDate().toString().padStart(2, '0');
      const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
      const year = currentDate.getFullYear();
      const formattedDate = `${day}-${month}-${year}`;

      const worksheetData = [
        ["Bilan Carbone Énergie (kg CO₂e)", "Électricité", "Gaz", "Vapeur", "Froid", "Date"],
        [totalEnergieCO2, emissionElectricite, emissionGaz, emissionVapeur, emissionFroid, formattedDate]
      ];

      const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Énergie");
      const fileName = `Bilan_Carbone_Energie_${formattedDate}.xlsx`;
      XLSX.writeFile(workbook, fileName);
    }

    function goBackEnergie() {
      document.getElementById("form-section-energie").style.display = "block";
      document.getElementById("result-section-energie").style.display = "none";
    }

    function resetEnergie() {
      document.getElementById("form-section-energie").querySelector("form").reset();
      emissionElectricite = 0;
      emissionGaz = 0;
      emissionVapeur = 0;
      emissionFroid = 0;
      totalEnergieCO2 = 0;
      document.getElementById("result-section-energie").style.display = 'none';
      document.getElementById("form-section-energie").style.display = 'block';
    }


    /* ======================================================
       Code pour la partie "BDE"
    ====================================================== */
// Tableaux de stockage
let foods = [];
let drinks = [];
let wastes = [];
let orgTransports = [];
let peopleTransports = [];       // Déplacements d'invités
let participantTransports = [];  // Déplacements de participants (si hors école)
let purchases = [];
let services = [];

// Variables de calcul
//let totalCO2 = 0;
let co2Food = 0;
let co2Drinks = 0;
let co2Waste = 0;
let co2Purchases = 0;
let co2Services = 0;
let co2OrgTransport = 0;
let co2PeopleTransport = 0;
let co2ParticipantTransport = 0;
let electricityCO2 = 0;
let gasCO2 = 0;
let eventDescription = "";
let participants = 0;

// --- Fonctions d'ajout et mise à jour des listes ---

// Alimentation
function addFood() {
    const foodItem = document.getElementById("food-item").value;
    const foodQuantity = parseFloat(document.getElementById("food-quantity").value);
    if (foodItem && foodQuantity) {
        foods.push({ item: foodItem, quantity: foodQuantity });
        updateFoodList();
    }
}
function updateFoodList() {
    const foodList = document.getElementById("food-list");
    foodList.innerHTML = '';
    foods.forEach(food => {
        const li = document.createElement('li');
        li.textContent = `${food.item} - ${food.quantity}`;
        foodList.appendChild(li);
    });
}

// Boissons
function addDrink() {
    const drinkItem = document.getElementById("drink-item").value;
    const drinkQuantity = parseFloat(document.getElementById("drink-quantity").value);
    if (drinkItem && drinkQuantity) {
        drinks.push({ item: drinkItem, quantity: drinkQuantity });
        updateDrinkList();
    }
}
function updateDrinkList() {
    const drinkList = document.getElementById("drink-list");
    drinkList.innerHTML = '';
    drinks.forEach(drink => {
        const li = document.createElement('li');
        li.textContent = `${drink.item} - ${drink.quantity} L`;
        drinkList.appendChild(li);
    });
}

// Déchets
function addWaste() {
    const wasteType = document.getElementById("waste-type").value;
    const wasteQuantity = parseFloat(document.getElementById("waste-quantity").value);
    if (wasteType && wasteQuantity) {
        wastes.push({ type: wasteType, quantity: wasteQuantity });
        updateWasteList();
    }
}
function updateWasteList() {
    const wasteList = document.getElementById("waste-list");
    wasteList.innerHTML = '';
    wastes.forEach(waste => {
        const li = document.createElement('li');
        li.textContent = `${waste.type} - ${waste.quantity}`;
        wasteList.appendChild(li);
    });
}

// Achats
function addPurchase() {
    const purchaseItem = document.getElementById("purchase-item").value;
    const purchaseQuantity = parseInt(document.getElementById("purchase-quantity").value);
    if (purchaseItem && !isNaN(purchaseQuantity) && purchaseQuantity > 0) {
        purchases.push({ item: purchaseItem, quantity: purchaseQuantity });
        updatePurchaseList();
    }
}
function updatePurchaseList() {
    const purchaseList = document.getElementById("purchase-list");
    purchaseList.innerHTML = '';
    purchases.forEach(purchase => {
        const li = document.createElement('li');
        li.textContent = `${purchase.item} - ${purchase.quantity}`;
        purchaseList.appendChild(li);
    });
}

// Transports organisation (courses)
function addOrgTransport() {
    const distance = parseFloat(document.getElementById("org-distance").value);
    const mode = document.getElementById("org-transport-mode").value;
    if (!isNaN(distance) && distance > 0 && mode) {
        orgTransports.push({ distance: distance, mode: mode });
        updateOrgTransportList();
    }
}
function updateOrgTransportList() {
    const list = document.getElementById("org-transport-list");
    list.innerHTML = '';
    orgTransports.forEach(ot => {
        const li = document.createElement('li');
        li.textContent = `Distance: ${ot.distance} km, Mode: ${ot.mode}`;
        list.appendChild(li);
    });
}
function calculateOrgTransportCO2() {
    const factors = {
        voiture: 0.178,
        velo: 0,
        marche: 0,
        tramway: 0.0296,
        bus: 0.146
    };
    let total = 0;
    orgTransports.forEach(ot => {
        let factor = factors[ot.mode] || 0;
        total += ot.distance * factor;
    });
    return total;
}

// Transports d'invités
function addPeopleTransport() {
    const mode = document.getElementById("people-transport-mode").value;
    const distance = parseFloat(document.getElementById("people-distance").value);
    const number = parseInt(document.getElementById("people-number").value);
    if (mode && !isNaN(distance) && distance > 0) {
        if (isNaN(number) || number < 1) {
            alert("Veuillez renseigner un nombre valide (>=1).");
            return;
        }
        peopleTransports.push({ mode: mode, distance: distance, number: number });
        updatePeopleTransportList();
    }
}
function updatePeopleTransportList() {
    const list = document.getElementById("people-transport-list");
    list.innerHTML = '';
    peopleTransports.forEach(pt => {
        const li = document.createElement('li');
        li.textContent = `Mode: ${pt.mode}, Distance: ${pt.distance} km, ${pt.mode.toLowerCase() === "voiture" ? "Voitures" : "Personnes"}: ${pt.number}`;
        list.appendChild(li);
    });
}
function calculatePeopleTransportCO2() {
    const factors = {
        voiture: 0.178,
        train: 0.045,    // Exemple de facteur (modifiable)
        tramway: 0.0296,
        bus: 0.146,
        marche: 0,
        velo: 0
    };
    let total = 0;
    peopleTransports.forEach(pt => {
        let factor = factors[pt.mode.toLowerCase()] || 0;
        total += pt.distance * factor * pt.number;
    });
    return total;
}

// Transports de participants
function addParticipantTransport() {
    const mode = document.getElementById("participant-transport-mode").value;
    const distance = parseFloat(document.getElementById("participant-distance").value);
    const number = parseInt(document.getElementById("participant-number").value);
    if (mode && !isNaN(distance) && distance > 0) {
        if (isNaN(number) || number < 1) {
            alert("Veuillez renseigner un nombre valide (>=1).");
            return;
        }
        participantTransports.push({ mode: mode, distance: distance, number: number });
        updateParticipantTransportList();
    }
}
function updateParticipantTransportList() {
    const list = document.getElementById("participant-transport-list");
    list.innerHTML = '';
    participantTransports.forEach(pt => {
        const li = document.createElement('li');
        li.textContent = `Mode: ${pt.mode}, Distance: ${pt.distance} km, ${pt.mode.toLowerCase() === "voiture" ? "Voitures" : "Personnes"}: ${pt.number}`;
        list.appendChild(li);
    });
}
function calculateParticipantTransportCO2() {
    const factors = {
        voiture: 0.178,
        train: 0.045,
        tramway: 0.0296,
        bus: 0.146,
        marche: 0,
        velo: 0
    };
    let total = 0;
    participantTransports.forEach(pt => {
        let factor = factors[pt.mode.toLowerCase()] || 0;
        total += pt.distance * factor * pt.number;
    });
    return total;
}

// Location de matériel/service
function addService() {
    const serviceItem = document.getElementById("service-item").value;
    const serviceQuantity = parseInt(document.getElementById("service-quantity").value);
    if (serviceItem && !isNaN(serviceQuantity) && serviceQuantity > 0) {
        services.push({ item: serviceItem, quantity: serviceQuantity });
        updateServiceList();
    }
}
function updateServiceList() {
    const list = document.getElementById("service-list");
    list.innerHTML = '';
    services.forEach(service => {
        const li = document.createElement('li');
        li.textContent = `${service.item} - ${service.quantity}`;
        list.appendChild(li);
    });
}
function calculateServiceCO2() {
    const serviceEmissionFactors = {
        'hebergement': 0.32, // outil BNEI
        'activité':0.27, //outil BNEI
        'cadeau':0.422,
        'animation':0.12, //outil ges 1.5
        'location':0.28 //outil ges 1.5
    };
    let total = 0;
    services.forEach(service => {
        const factor = serviceEmissionFactors[service.item.toLowerCase()] || 0;
        total += factor * service.quantity;
    });
    return total;
}

// --- Mise à jour des labels selon le mode sélectionné ---
function updatePeopleNumberLabel() {
    const mode = document.getElementById("people-transport-mode").value;
    const label = document.getElementById("people-number-label");
    label.textContent = (mode.toLowerCase() === "voiture") ? "Nombre de voitures :" : "Nombre de personnes :";
}
function updateParticipantNumberLabel() {
    const mode = document.getElementById("participant-transport-mode").value;
    const label = document.getElementById("participant-number-label");
    label.textContent = (mode.toLowerCase() === "voiture") ? "Nombre de voitures :" : "Nombre de personnes :";
}

// --- Affichage conditionnel ---
function toggleGasQuantity() {
    const gasSelect = document.getElementById("gas-used");
    const gasQuantityContainer = document.getElementById("gas-quantity-container");
    gasQuantityContainer.style.display = (gasSelect.value === "none") ? "none" : "block";
}
function toggleEnergyAndParticipantSection() {
    const locationSelect = document.getElementById("event-location-outside");
    const energySection = document.getElementById("energy");
    const participantSection = document.getElementById("participant-transport-section");
    if (locationSelect.value === "oui") {
        energySection.style.display = "block";
        participantSection.style.display = "block";
    } else {
        energySection.style.display = "none";
        participantSection.style.display = "none";
    }
}

// --- Calcul des émissions ---
function calculateFoodCO2() {
    const foodEmissionsPerKg = {
        'viennoiserie': 0.21,
        'sandwichpoulet': 0.705,
        'sandwichvege': 0.378,
        'repasviandeblanchepoisson': 1.35,
        'pizza4fromages': 1.404,
        'oeufs': 0.1435,
        'madeleines': 0.09378,
        'lasagnes': 2.19,
        'knackis': 0.5145,
        'lait': 1.5347,
        'glaces': 0.31,
        'concombre': 1.944,
        'baguette': 0.134
    };
    let total = 0;
    foods.forEach(food => {
        const emission = foodEmissionsPerKg[food.item.toLowerCase()] || 0;
        total += emission * food.quantity;
    });
    return total;
}
function calculateDrinkCO2() {
    const drinkEmissionsPerLiter = {
        'jus': 0.801,
        'soda': 0.572,
        'vin': 1.14,
        'biere': 1.09,
        'cafe': 0.557,
        'eau': 0.453,
        'alcool': 1.15
    };
    let total = 0;
    drinks.forEach(drink => {
        const emission = drinkEmissionsPerLiter[drink.item.toLowerCase()] || 0;
        total += emission * drink.quantity;
    });
    return total;
}
function calculateWasteCO2() {
  //--------------FE venant du tableur BILAN GES--------
    const wasteEmissionsPerKg = {
        'plastique': 0.122, //plastique bio-sourcé PE
        'dechet-menager': 0.386, //ordures ménagers résiduelles
        'metaux': 0.938, //metaux Ferreurx 
        'verre':0.496, // verre fin de vie moyenne
        'bio-déchets':0.02,//dechets vert compostage domestique en tas
        'papiers-cartons':0.737 //carton fin de vie moyenne
    };
    let total = 0;
    wastes.forEach(waste => {
        const emission = wasteEmissionsPerKg[waste.type.toLowerCase()] || 0;
        total += emission * waste.quantity;
    });
    return total;
}
function calculatePurchaseCO2() {
    const purchaseEmissionsPerUnit = {
        'console de salon': 73.7,
        'enceinte musicale': 8.98,
        'projecteur': 145,
        'photo':24.4,
        'raclette':16.8,
        'machinecafe':47.6,
        'four':82.7,
        'gobelet':0.008,
        'ski':15,
        'meuble':907,
        'ballon':0.0065,
        'cables':0.38
        
    };
    let total = 0;
    purchases.forEach(purchase => {
        const factor = purchaseEmissionsPerUnit[purchase.item.toLowerCase()] || 0;
        total += factor * purchase.quantity;
    });
    return total;
}

// Mise à jour du graphique (camembert)
function displayCarbonChart(co2Food, co2Drinks, co2Waste, co2OrgTransport, co2PeopleTransport, co2ParticipantTransport, co2Purchases, co2Services, electricityCO2, gasCO2) {
    let labels = ['Alimentation', 'Boissons', 'Déchets', 'Transport organisation', 'Dépl. invités'];
    let data = [co2Food, co2Drinks, co2Waste, co2OrgTransport, co2PeopleTransport];
    if (typeof co2ParticipantTransport !== "undefined") {
        labels.push('Dépl. participants');
        data.push(co2ParticipantTransport);
    }
    labels.push('Achats');
    data.push(co2Purchases);
    labels.push('Location de mat./service');
    data.push(co2Services);
    if (typeof electricityCO2 !== "undefined" && typeof gasCO2 !== "undefined") {
       labels.push('Électricité', 'Chauffage au gaz');
       data.push(electricityCO2, gasCO2);
    }
    
    const backgroundColors = ['#FFB6C1', '#87CEEB', '#32CD32', '#FFD700', '#FFA500', '#9370DB', '#FFC0CB', '#90EE90', '#ADD8E6', '#D3D3D3'];
    const borderColors = ['#FF6347', '#4682B4', '#228B22', '#DAA520', '#FF8C00', '#8A2BE2', '#FF69B4', '#32CD32', '#00008B', '#696969'];
    
    const ctx = document.getElementById('co2-pie-chart').getContext('2d');
    new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                label: 'Répartition des émissions de CO2 (kg CO₂e)',
                data: data,
                backgroundColor: backgroundColors.slice(0, labels.length),
                borderColor: borderColors.slice(0, labels.length),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { position: 'top' },
                tooltip: {
                    callbacks: {
                        label: function(tooltipItem) {
                            return `${tooltipItem.label}: ${tooltipItem.raw.toFixed(2)} kg CO2`;
                        }
                    }
                }
            }
        }
    });
}

// Export Excel
function exportToExcel() {
    if (totalCO2 === null) {
        alert("Veuillez d'abord calculer le bilan carbone avant d'exporter.");
        return;
    }
    const currentDate = new Date();
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();
    const formatteddate = `${day}-${month}-${year}`;

    const worksheetData = [
        ["Description", "Bilan Carbone Total (kg CO₂e)", "Alimentation", "Boissons", "Transport organisation", "Dépl. invités", "Dépl. participants", "Achats", "Déchets", "Location de mat./service", "Électricité", "Chauffage au gaz", "Nombre de Participants", "Date"],
        [eventDescription, totalCO2.toFixed(2), co2Food.toFixed(2), co2Drinks.toFixed(2), co2OrgTransport.toFixed(2), co2PeopleTransport.toFixed(2), (co2ParticipantTransport || 0).toFixed(2), co2Purchases.toFixed(2), co2Waste.toFixed(2), co2Services.toFixed(2), electricityCO2.toFixed(2), gasCO2.toFixed(2), participants, formatteddate]
    ];
    
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Résultats Bilan Carbone");
    const fileName = `Bilan_Carbone_${eventDescription}_${formatteddate}.xlsx`;
    XLSX.writeFile(workbook, fileName);
}

// Calcul global
function calculateCO2() {
    eventDescription = document.getElementById("event-description").value;
    participants = parseInt(document.getElementById("participants").value) || 0;
    const eventDateRaw = document.getElementById("event-date").value;
    let formattedDate = "";
    if (eventDateRaw) {
      const dateObj = new Date(eventDateRaw);
      const day = ("0" + dateObj.getDate()).slice(-2);
      const month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
      const year = dateObj.getFullYear().toString().slice(-2);
      formattedDate = `${day}-${month}-${year}`;
    }
    
    // Calcul des émissions par section
    co2OrgTransport = calculateOrgTransportCO2();
    co2PeopleTransport = calculatePeopleTransportCO2();
    co2Food = calculateFoodCO2();
    co2Drinks = calculateDrinkCO2();
    co2Waste = calculateWasteCO2();
    co2Purchases = calculatePurchaseCO2();
    co2Services = calculateServiceCO2();
    
    // Calcul énergie (si applicable)
    electricityCO2 = 0;
    gasCO2 = 0;
    if (document.getElementById("event-location-outside").value === "oui") {
        const elecConsumption = parseFloat(document.getElementById("electricity-consumption").value) || 0;
        electricityCO2 = elecConsumption * 0.0599;
        const gasUsed = document.getElementById("gas-used").value;
        if (gasUsed !== "none") {
            const gasQuantity = parseFloat(document.getElementById("gas-quantity").value) || 0;
            if (gasUsed === "natural") {
                gasCO2 = gasQuantity * 0.24;
            } else if (gasUsed === "fuel") {
                gasCO2 = gasQuantity * 0.3243;
            } else if(gasUsed=== "chauffage"){
              gasCO2 = gasQuantity * 0.038;
            }
        }
        co2ParticipantTransport = calculateParticipantTransportCO2();
    } else {
        co2ParticipantTransport = 0;
    }
    
    totalCO2 = co2OrgTransport + co2PeopleTransport + co2Food + co2Drinks + co2Waste + co2Purchases + electricityCO2 + gasCO2 + co2ParticipantTransport + co2Services;
    
    let resultHTML = `
        <p>Votre bilan carbone total pour l'événement <strong>${eventDescription}</strong> (le ${formattedDate}) avec <strong>${participants}</strong> participants est de <strong>${totalCO2.toFixed(2)} kg CO₂e</strong>.</p>
        <h2>Détail :</h2>
        <p>Alimentation : <strong>${co2Food.toFixed(2)} kg CO₂e</strong></p>
        <p>Boissons : <strong>${co2Drinks.toFixed(2)} kg CO₂e</strong></p>
        <p>Déchets : <strong>${co2Waste.toFixed(2)} kg CO₂e</strong></p>
        <p>Transport organisation : <strong>${co2OrgTransport.toFixed(2)} kg CO₂e</strong></p>
        <p>Déplacements d'invités : <strong>${co2PeopleTransport.toFixed(2)} kg CO₂e</strong></p>
    `;
    
    if (document.getElementById("event-location-outside").value === "oui") {
        resultHTML += `<p>Déplacements de participants : <strong>${co2ParticipantTransport.toFixed(2)} kg CO₂e</strong></p>`;
    }
    
    resultHTML += `
        <p>Achats de biens/services : <strong>${co2Purchases.toFixed(2)} kg CO₂e</strong></p>
        <p>Location de matériel/service : <strong>${co2Services.toFixed(2)} kg CO₂e</strong></p>
    `;
    
    if (document.getElementById("event-location-outside").value === "oui") {
        resultHTML += `<p>Consommation d'électricité : <strong>${electricityCO2.toFixed(2)} kg CO₂e</strong></p>`;
        resultHTML += `<p>Chauffage au gaz : <strong>${gasCO2.toFixed(2)} kg CO₂e</strong></p>`;
    }
    
    document.getElementById('result').innerHTML = resultHTML;
    
    // Affichage du graphique
    displayCarbonChart(co2Food, co2Drinks, co2Waste, co2OrgTransport, co2PeopleTransport, co2ParticipantTransport, co2Purchases, co2Services, electricityCO2, gasCO2);
    
    // Passage du formulaire aux résultats
    document.getElementById('formulaire').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';
}

function goBack() {
    document.getElementById('formulaire').style.display = 'block';
    document.getElementById('result-section').style.display = 'none';
}

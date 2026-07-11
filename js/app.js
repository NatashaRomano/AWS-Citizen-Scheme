// ================================
// Citizen Scheme Assistant
// app.js
// ================================

// Replace with your API Gateway URL
const API_URL = "https://4k1wyl7nfg.execute-api.ap-south-1.amazonaws.com/prod/SchemeEligibilityFunction";

// ======================================
// FIND ELIGIBLE SCHEMES
// ======================================

async function findSchemes() {

    const name = document.getElementById("name").value.trim();
    const age = document.getElementById("age").value;
    const income = document.getElementById("income").value;
    const category = document.getElementById("category").value;
    const state = document.getElementById("state").value;

    if (!name || !age || !income || !category || !state) {
        alert("Please fill all fields.");
        return;
    }

    document.getElementById("loading").style.display = "block";
    document.getElementById("results").innerHTML = "";
    document.getElementById("pdfBtn").style.display = "none";

    try {

        const response = await fetch(API_URL, {

            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({

                name: name,
                age: Number(age),
                income: Number(income),
                category: category,
                state: state

            })

        });

        const result = await response.json();

        console.log(result);

        const schemes = Array.isArray(result)
            ? result
            : JSON.parse(result.body);

        let html = "";

        if (schemes.length === 0) {

            html = `
            <div class="scheme-card">
                <h3>No Matching Schemes Found</h3>
                <p>Try changing your search criteria.</p>
            </div>
            `;

        } else {

            schemes.forEach((scheme) => {

                html += `

                <div class="scheme-card">

                    <div class="badge">
                        ${scheme.category}
                    </div>

                    <h3>
                        ${scheme.name}
                    </h3>

                    <p>
                        <b>Benefit:</b>
                        ${scheme.benefit || "Benefit details not available"}
                    </p>

                    <p>
                        <b>Income Limit:</b>
                        ₹${Number(scheme.income_limit).toLocaleString("en-IN")}
                    </p>

                    <p>
                        <b>State:</b>
                        ${scheme.state}
                    </p>

                </div>

                `;

            });

        }

        document.getElementById("loading").style.display = "none";

        document.getElementById("results").innerHTML = html;

        if (schemes.length > 0) {
            document.getElementById("pdfBtn").style.display = "block";
        }

    }

    catch (err) {

        console.error(err);

        document.getElementById("loading").style.display = "none";

        document.getElementById("results").innerHTML = `

        <div class="scheme-card">

            <h3>Error</h3>

            <p>${err.message}</p>

        </div>

        `;

    }

}


// ======================================
// DOWNLOAD PDF REPORT
// ======================================

async function downloadPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    const cards = document.querySelectorAll(".scheme-card");

    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const income = document.getElementById("income").value;
    const category = document.getElementById("category").value;
    const state = document.getElementById("state").value;

    // Header

    doc.setFillColor(14,165,233);
    doc.rect(0,0,210,25,"F");

    doc.setFontSize(20);
    doc.setTextColor(255,255,255);

    doc.text("Citizen Scheme Eligibility Report",15,16);

    doc.setTextColor(0,0,0);

    let y = 35;

    // User Details

    doc.setFontSize(12);

    doc.roundedRect(12,y-5,185,38,3,3);

    doc.setFont(undefined,"bold");

    doc.text("Applicant Details",18,y+2);

    doc.setFont(undefined,"normal");

    doc.text(`Name : ${name}`,18,y+10);

    doc.text(`Age : ${age}`,18,y+18);

    doc.text(`Income : ₹${Number(income).toLocaleString("en-IN")}`,18,y+26);

    doc.text(`Category : ${category}`,110,y+10);

    doc.text(`State : ${state}`,110,y+18);

    y += 48;

    doc.setFontSize(16);

    doc.setFont(undefined,"bold");

    doc.text("Eligible Schemes",15,y);

    y += 10;

    cards.forEach((card,index)=>{

        if(y>240){

            doc.addPage();

            y=20;

        }

        const badge = card.querySelector(".badge")?.innerText || "";

        const title = card.querySelector("h3")?.innerText || "";

        const p = card.querySelectorAll("p");

        const benefit = p[0]?.innerText || "";

        const incomeLimit = p[1]?.innerText || "";

        const schemeState = p[2]?.innerText || "";

        doc.roundedRect(12,y-5,185,45,3,3);

        doc.setFont(undefined,"bold");

        doc.setFontSize(13);

        doc.text(`${index+1}. ${title}`,18,y+3);

        doc.setFont(undefined,"normal");

        doc.setFontSize(11);

        doc.text(`Category : ${badge}`,18,y+12);

        doc.text(benefit,18,y+20);

        doc.text(incomeLimit,18,y+28);

        doc.text(schemeState,18,y+36);

        y += 55;

    });

    // Footer

    const pages = doc.internal.getNumberOfPages();

    for(let i=1;i<=pages;i++){

        doc.setPage(i);

        doc.setFontSize(10);

        doc.text(

            `Generated by Citizen Scheme Assistant | Page ${i}/${pages}`,

            15,

            290

        );

    }

    doc.save("Citizen_Scheme_Report.pdf");

}
async function uploadFile()
{
    const file = document.getElementById("idProof").files[0];
    const response = await fetch(

"https://momdhxbtol.execute-api.ap-south-1.amazonaws.com",

{

method:"POST"

}

);

const data = await response.json();
await fetch(

data.uploadURL,

{

method:"PUT",

headers:{

"Content-Type":"image/jpeg"

},

body:file

}

);
await fetch(

"https://YOURAPI.amazonaws.com/prod/verify",

{

method:"POST",

headers:{

"Content-Type":"application/json"

},

body:JSON.stringify({

bucket:"citizen-id-proof-upload",

key:data.fileName

})

}

);
// ===============================
// Upload Aadhaar
// ===============================

async function verifyID() {

    const file = document.getElementById("aadhaar").files[0];

    if (!file) {
        alert("Please choose an Aadhaar file.");
        return;
    }

    alert("Selected File: " + file.name);

}
async function verifyID() {

    const file = document.getElementById("aadhaar").files[0];

    if (!file) {
        alert("Choose a file");
        return;
    }

    // Step 1 - Get Upload URL
    const response = await fetch(
        "YOUR_UPLOAD_API",
        {
            method: "POST"
        }
    );

    const data = await response.json();

    // Step 2 - Upload file directly to S3
    await fetch(data.uploadUrl, {
        method: "PUT",
        body: file
    });

    alert("File uploaded successfully!");
}

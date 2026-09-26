/* =====================================================
   AI MARKETING
   APP.JS

   Mesin utama aplikasi.
===================================================== */


/* =====================================================
   NAVIGATION
===================================================== */

const pageTitles = {

    dashboard: [
        "Dashboard",
        "Pusat kendali marketing bisnis Anda"
    ],

    business: [
        "Data Bisnis",
        "Kelola informasi dasar usaha"
    ],

    promotion: [
        "AI Pembuat Promosi",
        "Buat materi promosi dengan pilihan"
    ],

    target: [
        "AI Target Pelanggan",
        "Tentukan profil pelanggan"
    ],

    strategy: [
        "AI Strategi Marketing",
        "Buat strategi berdasarkan tujuan"
    ],

    planner: [
        "AI Content Planner",
        "Buat kalender konten marketing"
    ],

    followup: [
        "AI Customer Follow-Up",
        "Buat pesan untuk pelanggan"
    ],

    campaign: [
        "AI Campaign",
        "Buat paket kampanye marketing"
    ],

    analytics: [
        "Marketing Analytics",
        "Analisis data marketing"
    ],

    assistant: [
        "AI Marketing Assistant",
        "Pusat AI Marketing"
    ]

};


function navigateTo(pageName) {

    document
        .querySelectorAll(".page")
        .forEach(page => {

            page.classList.remove(
                "active"
            );

        });


    const target =
        document.getElementById(
            "page-" + pageName
        );


    if (target) {

        target.classList.add(
            "active"
        );

    }


    document
        .querySelectorAll(".nav-item")
        .forEach(button => {

            button.classList.remove(
                "active"
            );

            if (
                button.dataset.page ===
                pageName
            ) {

                button.classList.add(
                    "active"
                );

            }

        });


    if (pageTitles[pageName]) {

        document.getElementById(
            "pageTitle"
        ).textContent =
            pageTitles[pageName][0];


        document.getElementById(
            "pageSubtitle"
        ).textContent =
            pageTitles[pageName][1];

    }


    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    if (pageName === "analytics") {

        refreshAnalytics();

    }

}


document.addEventListener(
    "DOMContentLoaded",
    function () {

        document
            .querySelectorAll(".nav-item")
            .forEach(button => {

                button.addEventListener(
                    "click",
                    function () {

                        navigateTo(
                            this.dataset.page
                        );

                    }
                );

            });


        loadBusinessForm();

        updateProductSelects();

        updateDashboard();

        refreshAnalytics();

    }
);


/* =====================================================
   HELPER
===================================================== */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value
        : "";

}


function formatRupiah(value) {

    const number =
        Number(value) || 0;

    return new Intl.NumberFormat(
        "id-ID",
        {
            style: "currency",
            currency: "IDR",
            maximumFractionDigits: 0
        }
    ).format(number);

}


function showResult(
    elementId,
    html
) {

    const element =
        document.getElementById(
            elementId
        );

    if (!element) return;

    element.innerHTML = html;

    element.classList.remove(
        "hidden"
    );

}


function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   BUSINESS DATA
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const form =
            document.getElementById(
                "businessForm"
            );


        if (!form) return;


        form.addEventListener(
            "submit",
            async function (event) {

                event.preventDefault();


                const productText =
                    getValue(
                        "businessProducts"
                    );


                const products =
                    productText
                        .split(",")
                        .map(
                            item =>
                                item.trim()
                        )
                        .filter(Boolean);


                const business = {

                    id: "main",

                    name:
                        getValue(
                            "businessName"
                        ),

                    type:
                        getValue(
                            "businessType"
                        ),

                    products,

                    price:
                        Number(
                            getValue(
                                "businessPrice"
                            )
                        ) || 0,

                    target:
                        getValue(
                            "businessTarget"
                        ),

                    location:
                        getValue(
                            "businessLocation"
                        ),

                    advantage:
                        getValue(
                            "businessAdvantage"
                        ),

                    updatedAt:
                        new Date()
                            .toISOString()

                };


                saveBusinessData(
                    business
                );


                try {

                    await databaseSave(
                        "business",
                        business
                    );

                } catch (error) {

                    console.warn(
                        "IndexedDB:",
                        error
                    );

                }


                const message =
                    document.getElementById(
                        "businessMessage"
                    );


                message.textContent =
                    "Data bisnis berhasil disimpan.";

                message.classList.remove(
                    "hidden"
                );


                updateProductSelects();

                updateDashboard();

            }
        );

    }
);


/* =====================================================
   LOAD BUSINESS
===================================================== */

function loadBusinessForm() {

    const business =
        getBusinessData();


    document.getElementById(
        "businessName"
    ).value =
        business.name || "";


    document.getElementById(
        "businessType"
    ).value =
        business.type || "";


    document.getElementById(
        "businessProducts"
    ).value =
        Array.isArray(
            business.products
        )
            ? business.products.join(", ")
            : "";


    document.getElementById(
        "businessPrice"
    ).value =
        business.price || "";


    document.getElementById(
        "businessTarget"
    ).value =
        business.target || "";


    document.getElementById(
        "businessLocation"
    ).value =
        business.location || "";


    document.getElementById(
        "businessAdvantage"
    ).value =
        business.advantage || "";

}


/* =====================================================
   PRODUCT SELECTS
===================================================== */

function updateProductSelects() {

    const products =
        getBusinessProducts();


    const selectIds = [

        "promotionProduct",
        "targetProduct",
        "strategyProduct",
        "plannerProduct",
        "followupProduct",
        "campaignProduct"

    ];


    selectIds.forEach(id => {

        const select =
            document.getElementById(id);


        if (!select) return;


        const current =
            select.value;


        select.innerHTML = "";


        if (products.length === 0) {

            const option =
                document.createElement(
                    "option"
                );

            option.value = "";

            option.textContent =
                "Belum ada produk";

            select.appendChild(
                option
            );

            return;

        }


        products.forEach(product => {

            const option =
                document.createElement(
                    "option"
                );

            option.value =
                product;

            option.textContent =
                product;

            select.appendChild(
                option
            );

        });


        if (
            products.includes(current)
        ) {

            select.value =
                current;

        }

    });

}


/* =====================================================
   DASHBOARD
===================================================== */

function updateDashboard() {

    const business =
        getBusinessData();


    document.getElementById(
        "dashboardBusinessName"
    ).textContent =
        business.name ||
        "Belum diatur";


    document.getElementById(
        "dashboardProductCount"
    ).textContent =
        getBusinessProducts().length;


    document.getElementById(
        "dashboardTarget"
    ).textContent =
        business.target ||
        "Belum ditentukan";

}


/* =====================================================
   PROMOTION
===================================================== */

function generatePromotion() {

    const product =
        getValue(
            "promotionProduct"
        ) ||
        "produk Anda";


    const goal =
        getValue(
            "promotionGoal"
        );


    const media =
        getValue(
            "promotionMedia"
        );


    const style =
        getValue(
            "promotionStyle"
        );


    const business =
        getBusinessData();


    const name =
        business.name ||
        "usaha Anda";


    const location =
        business.location
            ? ` di ${business.location}`
            : "";


    const advantage =
        business.advantage ||
        "kualitas terbaik";


    let opening =
        "✨ Ada kabar menarik untuk Anda!";


    if (
        goal ===
        "Meningkatkan Penjualan"
    ) {

        opening =
            "🔥 Saatnya menikmati produk favorit Anda!";

    }


    if (
        goal ===
        "Mendapat Pelanggan Baru"
    ) {

        opening =
            "👋 Kenalan dengan produk favorit baru Anda!";

    }


    if (
        goal ===
        "Meningkatkan Repeat Order"
    ) {

        opening =
            "💜 Kangen dengan produk favorit Anda?";

    }


    const promotion = `

${opening}

☕ ${product}

Dari ${name}${location}, kami hadir dengan ${advantage}.

Nikmati ${product} dengan rasa dan pelayanan yang membuat Anda ingin kembali lagi.

🎯 Tujuan: ${goal}

📱 Pesan sekarang melalui ${media}.

Jangan sampai kehabisan!

#Promo #${product.replace(/\s+/g, "")} #Marketing

Gaya promosi: ${style}

`;


    showResult(
        "promotionResult",

        `
        <h3>✨ Hasil Promosi</h3>

        <p>
            <strong>Produk:</strong>
            ${escapeHTML(product)}
        </p>

        <p>
            <strong>Media:</strong>
            ${escapeHTML(media)}
        </p>

        <hr>

        <p>
            ${escapeHTML(
                promotion
            ).replace(
                /\n/g,
                "<br>"
            )}
        </p>
        `
    );


    const data = {

        product,
        goal,
        media,
        style,
        result: promotion,
        createdAt:
            new Date().toISOString()

    };


    savePromotion(data);

    databaseSave(
        "promotions",
        data
    ).catch(() => {});

}


/* =====================================================
   TARGET CUSTOMER
===================================================== */

function generateTarget() {

    const businessType =
        getValue(
            "targetBusinessType"
        );


    const product =
        getValue(
            "targetProduct"
        ) ||
        "produk Anda";


    const target =
        getValue(
            "targetCustomer"
        );


    const business =
        getBusinessData();


    let profile = "";


    switch (target) {

        case "Pelajar":

            profile =
                "Pelanggan usia sekolah yang cenderung menyukai harga terjangkau, produk praktis, dan promosi yang mudah dibagikan.";

            break;


        case "Mahasiswa":

            profile =
                "Mahasiswa yang membutuhkan produk terjangkau, praktis, menarik, dan mudah ditemukan melalui media sosial.";

            break;


        case "Karyawan":

            profile =
                "Karyawan yang membutuhkan produk praktis, berkualitas, dan memberikan manfaat yang jelas.";

            break;


        case "Ibu Rumah Tangga":

            profile =
                "Ibu rumah tangga yang mempertimbangkan manfaat, harga, kualitas, dan kemudahan pembelian.";

            break;


        case "Pengusaha":

            profile =
                "Pemilik usaha yang mencari produk atau layanan yang dapat membantu kebutuhan bisnis mereka.";

            break;


        case "Pelanggan sekitar lokasi":

            profile =
                "Orang yang berada di sekitar lokasi usaha dan memiliki kemungkinan melakukan pembelian karena jarak yang dekat.";

            break;


        default:

            profile =
                "Calon pelanggan umum yang membutuhkan produk dan tertarik pada manfaat, kualitas, serta penawaran yang sesuai.";

    }


    const result = `

    <h3>🎯 Profil Target Pelanggan</h3>

    <p>
        <strong>Jenis Usaha:</strong>
        ${escapeHTML(businessType)}
    </p>

    <p>
        <strong>Produk:</strong>
        ${escapeHTML(product)}
    </p>

    <p>
        <strong>Target:</strong>
        ${escapeHTML(target)}
    </p>

    <h4>Profil</h4>

    <p>
        ${escapeHTML(profile)}
    </p>

    <h4>Arah Marketing</h4>

    <ul>
        <li>Gunakan bahasa yang sesuai dengan target.</li>
        <li>Tampilkan manfaat produk dengan jelas.</li>
        <li>Gunakan media yang sering digunakan target.</li>
        <li>Buat penawaran yang mudah dipahami.</li>
    </ul>

    `;


    showResult(
        "targetResult",
        result
    );


    saveTarget({

        businessType,
        product,
        target,
        profile,

        createdAt:
            new Date().toISOString()

    });


    databaseSave(
        "targets",
        {
            businessType,
            product,
            target,
            profile,
            createdAt:
                new Date().toISOString()
        }
    ).catch(() => {});


    const businessTarget =
        getBusinessData();

    businessTarget.target =
        target;

    saveBusinessData(
        businessTarget
    );

    updateDashboard();

}


/* =====================================================
   STRATEGY
===================================================== */

function generateStrategy() {

    const goal =
        getValue(
            "strategyGoal"
        );


    const product =
        getValue(
            "strategyProduct"
        ) ||
        "produk utama";


    let actions = [];


    switch (goal) {

        case "Meningkatkan penjualan":

            actions = [

                "Buat penawaran yang mudah dipahami.",

                "Tampilkan manfaat utama produk.",

                "Promosikan melalui WhatsApp dan media sosial.",

                "Gunakan batas waktu promo untuk mendorong keputusan pembelian.",

                "Lakukan follow-up kepada calon pelanggan."

            ];

            break;


        case "Mendapat pelanggan baru":

            actions = [

                "Buat konten pengenalan produk.",

                "Gunakan promo khusus pelanggan baru.",

                "Tampilkan testimoni pelanggan.",

                "Gunakan konten yang mudah dibagikan.",

                "Arahkan calon pelanggan ke proses pembelian."

            ];

            break;


        case "Mengaktifkan pelanggan lama":

            actions = [

                "Identifikasi pelanggan yang sudah lama tidak membeli.",

                "Berikan pesan personal.",

                "Tawarkan promo khusus.",

                "Ingatkan produk yang pernah dibeli.",

                "Lakukan follow-up secara berkala."

            ];

            break;


        case "Memperkenalkan produk":

            actions = [

                "Jelaskan masalah yang dapat diselesaikan produk.",

                "Tampilkan keunggulan produk.",

                "Buat konten edukasi.",

                "Gunakan foto atau video produk.",

                "Berikan ajakan mencoba produk."

            ];

            break;


        case "Meningkatkan repeat order":

            actions = [

                "Hubungi pelanggan setelah pembelian.",

                "Berikan pengingat waktu pembelian berikutnya.",

                "Tawarkan paket atau promo pelanggan lama.",

                "Bangun komunikasi rutin.",

                "Berikan alasan untuk kembali membeli."

            ];

            break;


        default:

            actions = [

                "Tentukan penawaran utama.",

                "Pilih target pelanggan.",

                "Buat konten promosi.",

                "Publikasikan melalui media yang sesuai.",

                "Evaluasi hasil marketing."

            ];

    }


    const list =
        actions
            .map(
                item =>
                    `<li>${escapeHTML(item)}</li>`
            )
            .join("");


    const result = `

    <h3>📈 Strategi Marketing</h3>

    <p>
        <strong>Produk:</strong>
        ${escapeHTML(product)}
    </p>

    <p>
        <strong>Tujuan:</strong>
        ${escapeHTML(goal)}
    </p>

    <h4>Langkah Strategi</h4>

    <ol>
        ${list}
    </ol>

    `;


    showResult(
        "strategyResult",
        result
    );


    const data = {

        product,
        goal,
        actions,

        createdAt:
            new Date().toISOString()

    };


    saveStrategy(data);

    databaseSave(
        "strategies",
        data
    ).catch(() => {});

}


/* =====================================================
   CONTENT PLANNER
===================================================== */

function generatePlanner() {

    const period =
        getValue(
            "plannerPeriod"
        );


    const product =
        getValue(
            "plannerProduct"
        ) ||
        "Produk";


    const platform =
        getValue(
            "plannerPlatform"
        );


    const goal =
        getValue(
            "plannerGoal"
        );


    const contentTypes = [

        "Promosi",
        "Edukasi",
        "Testimoni",
        "Produk",
        "Promo",
        "Engagement",
        "Promo"

    ];


    const days = [

        "Senin",
        "Selasa",
        "Rabu",
        "Kamis",
        "Jumat",
        "Sabtu",
        "Minggu"

    ];


    let rows = "";


    days.forEach(
        (day, index) => {

            rows += `

            <tr>

                <td>
                    ${day}
                </td>

                <td>
                    ${contentTypes[index]}
                </td>

                <td>
                    ${escapeHTML(product)}
                </td>

                <td>
                    ${escapeHTML(platform)}
                </td>

                <td>
                    ${escapeHTML(goal)}
                </td>

            </tr>

            `;

        }
    );


    const result = `

    <h3>📅 Kalender Konten</h3>

    <p>
        Periode:
        <strong>${escapeHTML(period)}</strong>
    </p>

    <div style="overflow-x:auto">

        <table style="
            width:100%;
            border-collapse:collapse;
            margin-top:15px;
        ">

            <thead>

                <tr>

                    <th style="text-align:left;padding:10px">
                        Hari
                    </th>

                    <th style="text-align:left;padding:10px">
                        Jenis Konten
                    </th>

                    <th style="text-align:left;padding:10px">
                        Produk
                    </th>

                    <th style="text-align:left;padding:10px">
                        Platform
                    </th>

                    <th style="text-align:left;padding:10px">
                        Tujuan
                    </th>

                </tr>

            </thead>

            <tbody>
                ${rows}
            </tbody>

        </table>

    </div>

    `;


    showResult(
        "plannerResult",
        result
    );


    const data = {

        period,
        product,
        platform,
        goal,
        days: days.map(
            (day, index) => ({

                day,

                type:
                    contentTypes[index],

                product,

                platform,

                goal

            })
        ),

        createdAt:
            new Date().toISOString()

    };


    savePlanner(data);

    databaseSave(
        "planners",
        data
    ).catch(() => {});

}


/* =====================================================
   FOLLOW UP
===================================================== */

function generateFollowup() {

    const customerType =
        getValue(
            "followupCustomer"
        );


    const goal =
        getValue(
            "followupGoal"
        );


    const product =
        getValue(
            "followupProduct"
        ) ||
        "produk kami";


    const business =
        getBusinessData();


    const businessName =
        business.name ||
        "usaha kami";


    let message = "";


    if (
        customerType ===
        "Pelanggan baru"
    ) {

        message =
            `Halo 👋 Terima kasih sudah mengenal ${businessName}. Kami ingin memperkenalkan ${product} yang mungkin sesuai untuk Anda. Jika tertarik, kami siap membantu.`;

    }


    else if (
        customerType ===
        "Pelanggan lama"
    ) {

        message =
            `Halo 👋 Apa kabar? Kami dari ${businessName}. Kami ingin menginformasikan bahwa ${product} kembali tersedia. Semoga bisa menjadi pilihan Anda kembali 😊`;

    }


    else if (
        customerType ===
        "Belum membeli"
    ) {

        message =
            `Halo 👋 Kami ingin mengajak Anda mencoba ${product}. Jika Anda sedang mencari produk yang menarik dan sesuai kebutuhan, kami siap membantu.`;

    }


    else if (
        customerType ===
        "Sudah lama tidak membeli"
    ) {

        message =
            `Halo 👋 Sudah lama kami tidak bertemu. Kami dari ${businessName} ingin menyapa sekaligus mengingatkan bahwa ${product} masih tersedia. Kami senang jika bisa melayani Anda kembali.`;

    }


    else {

        message =
            `Halo 👋 Terima kasih sudah menjadi pelanggan setia ${businessName}. Kami ingin mengingatkan bahwa ${product} tersedia untuk pembelian berikutnya. Semoga kami bisa melayani Anda kembali 😊`;

    }


    const result = `

    <h3>💬 Pesan Follow-Up</h3>

    <p>
        <strong>Jenis Pelanggan:</strong>
        ${escapeHTML(customerType)}
    </p>

    <p>
        <strong>Tujuan:</strong>
        ${escapeHTML(goal)}
    </p>

    <hr>

    <p>
        ${escapeHTML(message)}
    </p>

    `;


    showResult(
        "followupResult",
        result
    );


    const data = {

        customerType,
        goal,
        product,
        message,

        createdAt:
            new Date().toISOString()

    };


    saveFollowup(data);

    databaseSave(
        "followups",
        data
    ).catch(() => {});

}


/* =====================================================
   CAMPAIGN
===================================================== */

function generateCampaign() {

    const product =
        getValue(
            "campaignProduct"
        ) ||
        "Produk";


    const target =
        getValue(
            "campaignTarget"
        );


    const goal =
        getValue(
            "campaignGoal"
        );


    const media =
        getValue(
            "campaignMedia"
        );


    const duration =
        getValue(
            "campaignDuration"
        );


    const business =
        getBusinessData();


    const businessName =
        business.name ||
        "Bisnis Anda";


    const campaignName =
        `${product} ${goal} - ${duration}`;


    const offer =
        `Penawaran khusus untuk ${target} yang tertarik dengan ${product}.`;


    const promotion =
        `🔥 ${product}

Hai ${target}! 👋

Ada penawaran menarik dari ${businessName}.

Jika Anda sedang membutuhkan ${product}, sekarang adalah waktu yang tepat untuk mencoba.

🎯 ${goal}

📱 Dapatkan informasi selengkapnya melalui ${media}.

Jangan lewatkan kesempatan ini!`;


    const contentIdeas = [

        `Pengenalan ${product}`,

        `Manfaat ${product}`,

        `Testimoni pelanggan`,

        `Promo ${product}`,

        `Behind the scene bisnis`,

        `Pertanyaan untuk ${target}`,

        `Reminder promo`

    ];


    const schedule = [

        "Hari 1 — Pengenalan produk",

        "Hari 2 — Edukasi manfaat",

        "Hari 3 — Testimoni",

        "Hari 4 — Penawaran",

        "Hari 5 — Engagement",

        "Hari 6 — Reminder",

        "Hari 7 — Closing"

    ];


    const result = `

    <h3>🚀 Campaign Berhasil Dibuat</h3>

    <h4>Nama Kampanye</h4>

    <p>
        ${escapeHTML(campaignName)}
    </p>

    <h4>Target</h4>

    <p>
        ${escapeHTML(target)}
    </p>

    <h4>Penawaran</h4>

    <p>
        ${escapeHTML(offer)}
    </p>

    <h4>Materi Promosi</h4>

    <p>
        ${escapeHTML(promotion)}
    </p>

    <h4>Ide Konten</h4>

    <ul>
        ${contentIdeas.map(
            item =>
                `<li>${escapeHTML(item)}</li>`
        ).join("")}
    </ul>

    <h4>Jadwal</h4>

    <ul>
        ${schedule.map(
            item =>
                `<li>${escapeHTML(item)}</li>`
        ).join("")}
    </ul>

    <h4>Follow-Up</h4>

    <p>
        Hubungi kembali pelanggan yang sudah melihat
        atau merespons promosi.
    </p>

    `;


    showResult(
        "campaignResult",
        result
    );


    const data = {

        campaignName,

        product,

        target,

        goal,

        media,

        duration,

        offer,

        promotion,

        contentIdeas,

        schedule,

        createdAt:
            new Date().toISOString()

    };


    saveCampaign(data);

    databaseSave(
        "campaigns",
        data
    ).catch(() => {});

}


/* =====================================================
   ANALYTICS
===================================================== */

async function refreshAnalytics() {

    const promotions =
        getPromotions();


    const targets =
        getTargets();


    const strategies =
        getStrategies();


    const campaigns =
        getCampaigns();


    const products =
        getBusinessProducts();


    let customers = 0;

    let transactions = 0;

    let sales = 0;


    try {

        const customerData =
            await databaseGetAllSafe(
                "customers"
            );

        customers =
            customerData.length;

    } catch (error) {

        customers = 0;

    }


    try {

        const transactionData =
            await databaseGetAllSafe(
                "transactions"
            );

        transactions =
            transactionData.length;


        transactionData.forEach(
            transaction => {

                sales +=
                    Number(
                        transaction.total
                    ) || 0;

            }
        );

    } catch (error) {

        transactions = 0;

    }


    document.getElementById(
        "analyticsPromotion"
    ).textContent =
        promotions.length;


    document.getElementById(
        "analyticsCustomer"
    ).textContent =
        customers;


    document.getElementById(
        "analyticsTransaction"
    ).textContent =
        transactions;


    document.getElementById(
        "analyticsSales"
    ).textContent =
        formatRupiah(sales);


    document.getElementById(
        "analyticsProduct"
    ).textContent =
        products.length;


    document.getElementById(
        "analyticsRevenue"
    ).textContent =
        formatRupiah(sales);


    let analysis = "";


    if (
        promotions.length === 0 &&
        campaigns.length === 0
    ) {

        analysis =
            "Belum ada aktivitas marketing. Mulailah dengan membuat promosi atau campaign.";

    }

    else if (
        promotions.length > 0 &&
        sales === 0
    ) {

        analysis =
            "Sistem sudah memiliki aktivitas promosi, tetapi belum menemukan data transaksi penjualan. Hubungkan data transaksi agar hasil marketing dapat dianalisis lebih lengkap.";

    }

    else {

        analysis =
            `Sistem mencatat ${promotions.length} aktivitas promosi, ${campaigns.length} campaign, ${transactions} transaksi, dan total penjualan ${formatRupiah(sales)}. Data ini dapat digunakan sebagai dasar evaluasi marketing.`;

    }


    document.getElementById(
        "analyticsText"
    ).innerHTML =
        `<p>${escapeHTML(analysis)}</p>`;

}


async function databaseGetAllSafe(
    storeName
) {

    if (!marketingDB) {

        throw new Error(
            "Database belum siap."
        );

    }


    return databaseGetAll(
        storeName
    );

}


/* =====================================================
   RECOMMENDATION
===================================================== */

function generateRecommendation() {

    const business =
        getBusinessData();


    const products =
        getBusinessProducts();


    const promotions =
        getPromotions();


    const campaigns =
        getCampaigns();


    const recommendations = [];


    if (!business.name) {

        recommendations.push(
            "Lengkapi Data Bisnis terlebih dahulu agar AI Marketing dapat bekerja dengan data usaha Anda."
        );

    }


    if (products.length === 0) {

        recommendations.push(
            "Tambahkan produk atau jasa yang ingin dipasarkan."
        );

    }


    if (promotions.length === 0) {

        recommendations.push(
            "Buat promosi pertama untuk mulai menjalankan aktivitas marketing."
        );

    }


    if (campaigns.length === 0) {

        recommendations.push(
            "Buat campaign untuk menggabungkan promosi, target, media, dan jadwal."
        );

    }


    if (
        recommendations.length === 0
    ) {

        recommendations.push(
            "Pertahankan aktivitas marketing dan gunakan Analytics untuk melihat hubungan antara promosi dan hasil penjualan."
        );

    }


    const html = `

    <h3>💡 Rekomendasi Marketing</h3>

    <ul>

        ${recommendations.map(
            item =>
                `<li>${escapeHTML(item)}</li>`
        ).join("")}

    </ul>

    `;


    showResult(
        "recommendationResult",
        html
    );

}


/* =====================================================
   RESET DATA MARKETING
===================================================== */

function resetMarketingData() {

    const confirmation =
        confirm(
            "Hapus seluruh data AI MARKETING?"
        );


    if (!confirmation) {
        return;
    }


    Object.values(
        STORAGE_KEYS
    ).forEach(
        key =>
            localStorage.removeItem(
                key
            )
    );


    location.reload();

}
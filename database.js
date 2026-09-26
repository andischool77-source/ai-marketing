/* =====================================================
   AI MARKETING
   DATABASE.JS

   IndexedDB untuk penyimpanan database lokal.
===================================================== */


const DB_NAME = "AI_MARKETING_DATABASE";

const DB_VERSION = 1;

let marketingDB = null;


/* =====================================================
   OPEN DATABASE
===================================================== */

function openMarketingDatabase() {

    return new Promise(
        (resolve, reject) => {

            const request =
                indexedDB.open(
                    DB_NAME,
                    DB_VERSION
                );


            request.onupgradeneeded =
                function (event) {

                    const db =
                        event.target.result;


                    if (!db.objectStoreNames.contains("business")) {

                        db.createObjectStore(
                            "business",
                            {
                                keyPath: "id"
                            }
                        );

                    }


                    if (!db.objectStoreNames.contains("promotions")) {

                        db.createObjectStore(
                            "promotions",
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }


                    if (!db.objectStoreNames.contains("targets")) {

                        db.createObjectStore(
                            "targets",
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }


                    if (!db.objectStoreNames.contains("strategies")) {

                        db.createObjectStore(
                            "strategies",
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }


                    if (!db.objectStoreNames.contains("planners")) {

                        db.createObjectStore(
                            "planners",
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }


                    if (!db.objectStoreNames.contains("followups")) {

                        db.createObjectStore(
                            "followups",
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }


                    if (!db.objectStoreNames.contains("campaigns")) {

                        db.createObjectStore(
                            "campaigns",
                            {
                                keyPath: "id",
                                autoIncrement: true
                            }
                        );

                    }

                };


            request.onsuccess =
                function (event) {

                    marketingDB =
                        event.target.result;

                    resolve(
                        marketingDB
                    );

                };


            request.onerror =
                function (event) {

                    reject(
                        event.target.error
                    );

                };

        }
    );
}


/* =====================================================
   SAVE TO INDEXEDDB
===================================================== */

function databaseSave(
    storeName,
    data
) {

    return new Promise(
        (resolve, reject) => {

            if (!marketingDB) {

                reject(
                    new Error(
                        "Database belum dibuka."
                    )
                );

                return;
            }


            const transaction =
                marketingDB.transaction(
                    storeName,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    storeName
                );


            const request =
                store.put(data);


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );
}


/* =====================================================
   GET ALL
===================================================== */

function databaseGetAll(
    storeName
) {

    return new Promise(
        (resolve, reject) => {

            if (!marketingDB) {

                reject(
                    new Error(
                        "Database belum dibuka."
                    )
                );

                return;
            }


            const transaction =
                marketingDB.transaction(
                    storeName,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    storeName
                );


            const request =
                store.getAll();


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );
}


/* =====================================================
   GET ONE
===================================================== */

function databaseGet(
    storeName,
    id
) {

    return new Promise(
        (resolve, reject) => {

            if (!marketingDB) {

                reject(
                    new Error(
                        "Database belum dibuka."
                    )
                );

                return;
            }


            const transaction =
                marketingDB.transaction(
                    storeName,
                    "readonly"
                );


            const store =
                transaction.objectStore(
                    storeName
                );


            const request =
                store.get(id);


            request.onsuccess =
                () => resolve(
                    request.result
                );


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );
}


/* =====================================================
   DELETE
===================================================== */

function databaseDelete(
    storeName,
    id
) {

    return new Promise(
        (resolve, reject) => {

            if (!marketingDB) {

                reject(
                    new Error(
                        "Database belum dibuka."
                    )
                );

                return;
            }


            const transaction =
                marketingDB.transaction(
                    storeName,
                    "readwrite"
                );


            const store =
                transaction.objectStore(
                    storeName
                );


            const request =
                store.delete(id);


            request.onsuccess =
                () => resolve(true);


            request.onerror =
                () => reject(
                    request.error
                );

        }
    );
}


/* =====================================================
   INITIALIZE
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function () {

        openMarketingDatabase()
            .then(() => {

                console.log(
                    "AI MARKETING database aktif."
                );

            })
            .catch(error => {

                console.error(
                    "Database error:",
                    error
                );

            });

    }
);
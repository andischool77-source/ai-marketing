/* =====================================================
   AI MARKETING
   STORAGE.JS

   Penyimpanan sederhana menggunakan localStorage.
===================================================== */


const STORAGE_KEYS = {
  
  BUSINESS: "ai_marketing_business",
  
  PROMOTIONS: "ai_marketing_promotions",
  
  TARGETS: "ai_marketing_targets",
  
  STRATEGIES: "ai_marketing_strategies",
  
  PLANNERS: "ai_marketing_planners",
  
  FOLLOWUPS: "ai_marketing_followups",
  
  CAMPAIGNS: "ai_marketing_campaigns"
  
};


/* =====================================================
   GENERIC STORAGE
===================================================== */

function saveStorage(key, data) {
  
  try {
    
    localStorage.setItem(
      key,
      JSON.stringify(data)
    );
    
    return true;
    
  } catch (error) {
    
    console.error(
      "Gagal menyimpan data:",
      error
    );
    
    return false;
  }
}


function getStorage(key, defaultValue = null) {
  
  try {
    
    const data =
      localStorage.getItem(key);
    
    if (data === null) {
      return defaultValue;
    }
    
    return JSON.parse(data);
    
  } catch (error) {
    
    console.error(
      "Gagal membaca data:",
      error
    );
    
    return defaultValue;
  }
}


function removeStorage(key) {
  
  localStorage.removeItem(key);
}


/* =====================================================
   BUSINESS
===================================================== */

function saveBusinessData(data) {
  
  return saveStorage(
    STORAGE_KEYS.BUSINESS,
    data
  );
}


function getBusinessData() {
  
  return getStorage(
    STORAGE_KEYS.BUSINESS,
    {
      name: "",
      type: "",
      products: [],
      price: 0,
      target: "",
      location: "",
      advantage: ""
    }
  );
}


/* =====================================================
   PRODUCTS
===================================================== */

function getBusinessProducts() {
  
  const business =
    getBusinessData();
  
  if (!business.products) {
    return [];
  }
  
  if (Array.isArray(business.products)) {
    return business.products;
  }
  
  return String(
      business.products
    )
    .split(",")
    .map(item => item.trim())
    .filter(Boolean);
}


/* =====================================================
   GENERIC ARRAY DATA
===================================================== */

function addStorageItem(key, item) {
  
  const current =
    getStorage(key, []);
  
  current.push(item);
  
  saveStorage(
    key,
    current
  );
  
  return item;
}


function getStorageItems(key) {
  
  return getStorage(
    key,
    []
  );
}


/* =====================================================
   MARKETING DATA
===================================================== */

function savePromotion(data) {
  
  return addStorageItem(
    STORAGE_KEYS.PROMOTIONS,
    data
  );
}


function getPromotions() {
  
  return getStorageItems(
    STORAGE_KEYS.PROMOTIONS
  );
}


function saveTarget(data) {
  
  return addStorageItem(
    STORAGE_KEYS.TARGETS,
    data
  );
}


function getTargets() {
  
  return getStorageItems(
    STORAGE_KEYS.TARGETS
  );
}


function saveStrategy(data) {
  
  return addStorageItem(
    STORAGE_KEYS.STRATEGIES,
    data
  );
}


function getStrategies() {
  
  return getStorageItems(
    STORAGE_KEYS.STRATEGIES
  );
}


function savePlanner(data) {
  
  return addStorageItem(
    STORAGE_KEYS.PLANNERS,
    data
  );
}


function getPlanners() {
  
  return getStorageItems(
    STORAGE_KEYS.PLANNERS
  );
}


function saveFollowup(data) {
  
  return addStorageItem(
    STORAGE_KEYS.FOLLOWUPS,
    data
  );
}


function getFollowups() {
  
  return getStorageItems(
    STORAGE_KEYS.FOLLOWUPS
  );
}


function saveCampaign(data) {
  
  return addStorageItem(
    STORAGE_KEYS.CAMPAIGNS,
    data
  );
}


function getCampaigns() {
  
  return getStorageItems(
    STORAGE_KEYS.CAMPAIGNS
  );
}
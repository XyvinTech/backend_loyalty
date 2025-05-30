const express = require('express');
const router = express.Router();
const { createTriggerServices, updateTriggerServices, deleteTriggerServices, getAllTriggerServices, getTriggerServicesById, getTriggerServicesByEventId } = require('./trigger_services.controller');
const { authorizePermission } = require('../../middlewares/auth/auth');
const { createAuditMiddleware } = require("../audit");
const { cacheInvalidationMiddleware,enhancedCacheInvalidationMiddleware } = require("../../middlewares/redis_cache/cache_invalidation.middleware"); 
const { cacheMiddleware, cacheKeys,cachePatterns } = require("../../middlewares/redis_cache/cache.middleware");


const triggerServicesAudit = createAuditMiddleware("trigger_services");



router.use(authorizePermission("MANAGE_SETTINGS"));


router.post('/', triggerServicesAudit.captureResponse(), triggerServicesAudit.adminAction("create_trigger_services", {
    description: "Admin created a new trigger services",
    targetModel: "TriggerServices",
    details: req => req.body
}),
    enhancedCacheInvalidationMiddleware(
        { pattern: cachePatterns.allTriggerServices }, // Clear all trigger services cache (all query variations)
        cacheKeys.triggerServicesById
      ),
    createTriggerServices
);

router.get('/', triggerServicesAudit.adminAction("get_all_trigger_services", {
    description: "Admin fetched all trigger services",
    targetModel: "TriggerServices",
    details: req => req.body
}),
    cacheMiddleware(60, cacheKeys.allTriggerServices),  
    getAllTriggerServices
);

router.get('/:id', triggerServicesAudit.adminAction("get_trigger_services_by_id", {
    description: "Admin fetched trigger services by id",
    targetModel: "TriggerServices",
    details: req => req.params
}),
    cacheMiddleware(60, cacheKeys.triggerServicesById ) ,
    getTriggerServicesById
);

router.put('/:id', triggerServicesAudit.captureResponse(), triggerServicesAudit.adminAction("update_trigger_services", {
    description: "Admin updated trigger services by id",
    targetModel: "TriggerServices",
    details: req => req.params
}),
    enhancedCacheInvalidationMiddleware(
        { pattern: cachePatterns.allTriggerServices }, // Clear all trigger services cache (all query variations)
        cacheKeys.triggerServicesById
      ),
    updateTriggerServices
);

router.delete('/:id', triggerServicesAudit.captureResponse(), triggerServicesAudit.adminAction("delete_trigger_services", {
    description: "Admin deleted trigger services by id",
    targetModel: "TriggerServices",
    details: req => req.params
}),
    enhancedCacheInvalidationMiddleware(
        { pattern: cachePatterns.allTriggerServices }, // Clear all trigger services cache (all query variations)
        cacheKeys.triggerServicesById
      ),
    deleteTriggerServices
);


router.get('/trigger-event/:eventId', triggerServicesAudit.adminAction("get_trigger_services_by_event_id", {
    description: "Admin fetched trigger services by event id",
    targetModel: "TriggerServices",
    details: req => req.params
}),
    getTriggerServicesByEventId
);

module.exports = router;











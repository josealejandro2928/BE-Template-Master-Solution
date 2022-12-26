
"use strict";

const getProfile = async (req, res, next) => {
    const { Profile } = req.app.get('models')
    const profile = await Profile.findOne({ where: { id: req.get('profile_id') || 0 } });
    if (!profile) {
        return next({ status: 401, message: "Invalid user credentials" });
    }
    req.profile = profile
    next()
}
module.exports = { getProfile }
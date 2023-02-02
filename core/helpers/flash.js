//flash messages can be used only once



exports.getFlash = (req) => {
    return { success: req.flash('success'), error: req.flash('error') }
}

exports.setFlashSuccess = (req, value) => {
    return req.flash('success', value)
}

exports.getFlashSuccess = (req) => {
    return req.flash('success')
}

exports.setFlashError = (req, value) => {
    return req.flash('error', value)
}

exports.getFlashError = (req) => {
    return req.flash('error')
}
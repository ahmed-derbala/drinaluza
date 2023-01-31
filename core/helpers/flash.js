exports.getFlash = (req) =>{
    const success = req.flash('success');
    const error = req.flash('error');
    return {success,error}
}


exports.setFlashSuccess = (req,value) =>{
    console.log('setFlashSuccess');
    return req.flash('success',value)
}

exports.setFlashError = (req,value) =>{
    console.log('setFlashError');
    return req.flash('error',value)
}

exports.getFlashSuccess = (req) =>{
    console.log('getFlashSuccess');
    return req.flash('success')
}

exports.getFlashError = (req) =>{
    console.log('getFlashError');
    return req.flash('error')
}
import handbookService from '../services/handbookService';

let createHandbook = async (req, res) => {
    try {
        let info = await handbookService.createHandbook(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getAllHandbook = async (req, res) => {
    try {
        let info = await handbookService.getAllHandbook();
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}

let getDetailHandbookById = async (req, res) => {
    try {
        let info = await handbookService.getDetailHandbookById(req.query.id);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}
let deleteHandbook = async (req, res) => {
    try {
        let info = await handbookService.deleteHandbook(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}
let editHandbook = async (req, res) => {
    try {
        let info = await handbookService.editHandbook(req.body);
        return res.status(200).json(info);
    } catch (e) {
        console.log(e);
        return res.status(200).json({
            errCode: -1,
            errMessage: 'Error from server...'
        })
    }
}
module.exports = {
    createHandbook: createHandbook,
    getAllHandbook: getAllHandbook,
    getDetailHandbookById: getDetailHandbookById,
    deleteHandbook: deleteHandbook,
    editHandbook: editHandbook
}
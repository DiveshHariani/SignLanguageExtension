const Model = require("./../modules/hoster");
const catchAsync = require("./../utils/catchAsync");

exports.getHoster = catchAsync(async (req, res) => {
    let hoster = await Model.findOne({hoster_link: req.params.id});
    if(hoster){
        return res.json({
            status: "ok",
            sentence: hoster.sentence
        });
    }
    return res.json({
        status: "ok"
    });
});

exports.createHoster = catchAsync(async (req, res) => {
    try{
        const testHoster =  await Model.findOne({hoster_link: req.params.id, token: req.params.token});
        if(testHoster){
            return res.json({
                status: "again"
            });
        }
        await Model.create({hoster_link: req.params.id, token: req.params.token});
        return res.json({
            status: "ok"
        });
    }catch(er){
        return res.json({
            status: "failed"
        });

    }
});

exports.updateHoster = catchAsync(async (req, res) => {
    await Model.findOneAndUpdate({token: req.params.token}, {
        sentence: req.body.sentence
    }, {
        upsert:true
    });
    res.status(203).json({
        status: "ok"
    });
});

exports.deleteHoster = catchAsync(async (req, res) => {
    try{
        let deleted = await Model.deleteOne({hoster_link: req.params.id, token: req.params.token});
        if(deleted.n == 1){
            return res.json({
                status: "ok"
            });
        }
        throw Error('bad auth!');
    }catch(er){
        return res.json({
            status: "failed"
        });

    }
});
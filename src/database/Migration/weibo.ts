const weiboMigration = {
    1:function(oldDoc:any){
        oldDoc.repostingId = undefined;
        oldDoc.repostComments = [];
        return oldDoc;
    }
}

export {weiboMigration}
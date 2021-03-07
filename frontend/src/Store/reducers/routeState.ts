import { routeState as actionTypes } from '../actionTypes'
import _ from 'lodash';

const initState = {
    weiboList: {
        page: 1,
        pageSize: 10,
        id: ""
    },
    weiboContent: {
        page: 1,
        pageSize: 10,
        id: ""
    }
}


function routeState(state = initState, action: { type: string, payload: string | number }) {
    const { type, payload } = action;
    switch (type) {
        case actionTypes.weiboList.id: {
            const newState = _.cloneDeep(state);
            _.set(newState, "weiboList.id", payload);
            return newState;
        }
        case actionTypes.weiboList.page:{
            const newState = _.cloneDeep(state);
            _.set(newState, "weiboList.page", payload);
            return newState;
        }
        case actionTypes.weiboList.pageSize:{
            const newState = _.cloneDeep(state);
            _.set(newState, "weiboList.pageSize", payload);
            return newState;
        }
        case actionTypes.weiboContent.id:{
            const newState = _.cloneDeep(state);
            _.set(newState, "weiboContent.id", payload);
            return newState;
        }
        case actionTypes.weiboContent.page:{
            const newState = _.cloneDeep(state);
            _.set(newState, "weiboContent.page", payload);
            return newState;
        }
        case actionTypes.weiboContent.pageSize:{
            const newState = _.cloneDeep(state);
            _.set(newState, "weiboContent.pageSize", payload);
            return newState;
        }default:{
            return state;
        }
    }
};

export {routeState};
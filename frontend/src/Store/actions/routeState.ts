import {routeState as actionTypes} from '../actionTypes'
import _ from 'lodash'

function updateRouteStateCreator(route:'weiboList'|'weiboContent',item:"page"|'pageSize'|"id",value:string|number){
    return {
        type: _.get(actionTypes,`${route}.${item}`),
        payload:value
    }
};

export {updateRouteStateCreator}
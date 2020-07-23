import ajax from './Ajax'

import {REGISTER,AGREEMENT,TAKEPHOTO} from './Urls'

export const UserRegister = (data) => ajax.post(REGISTER,data);
export const getAgreements=()=>ajax.get(AGREEMENT);
export const postPhoto=(data)=>ajax.post(TAKEPHOTO,data);
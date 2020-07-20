import ajax from './Ajax'

import {REGISTER,AGREEMENT} from './Urls'

export const UserRegister = (data) => ajax.post(REGISTER,data);
export const getAgreements=()=>ajax.get(AGREEMENT);
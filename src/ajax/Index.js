import ajax from './Ajax'

import {REGISTER} from './Urls'

export const UserRegister = (data) => ajax.post(REGISTER,data);
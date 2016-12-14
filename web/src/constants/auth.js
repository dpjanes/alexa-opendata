/*
 *  xxx.js
 *
 *  David Janes
 *  IOTDB.org
 *  2016-12-01
 *
 *  Copyright [2013-2017] [David P. Janes]
 *
 *  This program is free software: you can redistribute it and/or modify
 *  it under the terms of the GNU General Public License as published by
 *  the Free Software Foundation, either version 3 of the License, or
 *  (at your option) any later version.
 *  
 *  This program is distributed in the hope that it will be useful,
 *  but WITHOUT ANY WARRANTY; without even the implied warranty of
 *  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 *  GNU General Public License for more details.
 *  
 *  You should have received a copy of the GNU General Public License
 *  along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

export default {
	// ACTIONS
	AUTH_OPEN: 'AUTH_OPEN',
	AUTH_LOGIN: 'AUTH_LOGIN',
	AUTH_LOGOUT: 'AUTH_LOGOUT',

	// STATES
	AUTH_ANONYMOUS: 'AUTH_ANONYMOUS',
	AUTH_AWAITING_RESPONSE: 'AUTH_AWAITING_RESPONSE',
	AUTH_LOGGED_IN: 'AUTH_LOGGED_IN',
};

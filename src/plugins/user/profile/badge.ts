import badges from '../../../lib/util/json/badges.json'

export default (userBadges: string[]): string => {
    let badgeString = ''
    if (userBadges.includes('verified')) badgeString += '<:verified:741052337744904212>'

    return badgeString
}
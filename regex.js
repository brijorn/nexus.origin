/* const regex= /(? =\s?(? =(\d+)\s?d(? =ays?|ay?)?)?\s?(? =(\d+)\s?h(? =ours?|rs?)?)?\s?(? =(\d+)\s?m(? =inutes?|in)?))\i/;

let string = '5 days 3 hours 6 min'

string = regex.exec(string)

console.log(string)

const [
    time,
    hours,
    minutes, 
    seconds
] = string

console.log(hours)

*/
const Regex = {
	NICKNAME_REGEX: /(['])(?:(?=(\\?))\2.)*?\1/,
	
}

let args = "asset add 1-250 5 'Big Potato' 3456654321,2565786543"


const options = ['all', 'nickname', 'hierarchy']
const element = '--editexisting(all,idiot)'
            const BRACKET_REGEX = /\((.*?)\)/g
            const insideBrackets = BRACKET_REGEX.exec(element)
            console.log(insideBrackets)
				if (insideBrackets == null) {
					valid = false
                return console.log('no brackets')
                }
                else {
                if (insideBrackets[1].split(',').forEach(e => {if (options.includes(e)==false) console.log('Invalid')}))
                console.log(insideBrackets[1].split(','))
                }

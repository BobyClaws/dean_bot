const evenSpace = (text) => {
    
    let prev = null;
    let result = '';
    text = text.trim();
    
    for(let i = 0; i < text.length; i++) {
        letter = text[i];
        if(prev == ' ' && letter == ' ') 
            continue
        result = result.concat(letter);
        prev = letter;
    }
    return result;
}

module.exports = {evenSpace};
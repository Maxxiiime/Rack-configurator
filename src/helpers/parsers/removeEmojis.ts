const removeEmojis = (string: string) => {
	const emojiString = /(\p{Emoji_Presentation}|\p{Extended_Pictographic})/gu;
	return string.replace(emojiString, "");
};

export default removeEmojis;

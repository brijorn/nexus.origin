import nodefetch from 'node-fetch' 
export default async (id: string | number, size: string | number, type = 'user') => {
	if (type === 'user') {
		const thumbnail = await nodefetch(`https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${id}&size=${size}x${size}&format=Png&isCircular=false`).then(async bod => {
			const body = await bod.json();
			return body.data[0].imageUrl;
		});
		return thumbnail;
	}
	if (type === 'group') {
		const thumbnail = await nodefetch(`https://thumbnails.roblox.com/v1/groups/icons?format=Png&groupIds=${id}&isCircular=false&size=420x420`).then(async bod => {
			const body = await bod.json();
			return body.data[0].imageUrl;
		});
		return thumbnail;
	}
	if (type === 'asset') {
		const thumbnail = await nodefetch(`https://thumbnails.roblox.com/v1/assets?assetIds=${id}&format=Png&isCircular=false&size=420x420`).then(async bod => {
			const body = await bod.json();
			return body.data[0].imageUrl;
		});
		return thumbnail;
	}
	if (type === 'game') {
		const thumbnail = await nodefetch(`https://thumbnails.roblox.com/v1/games/icons?format=Png&isCircular=true&returnPolicy=PlaceHolder&size=512x512&universeIds=${id}`).then(async bod => {
			const body = await bod.json();
			const image = body.data[0].imageUrl;
			return image;
		});
		return thumbnail;
	}
};
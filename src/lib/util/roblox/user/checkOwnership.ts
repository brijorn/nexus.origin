import nodefetch from 'node-fetch'

export default async (userId: number | string, assetId: number | string) => {
	const res = await nodefetch(`http://api.roblox.com/Ownership/HasAsset?userId=${userId}&assetId=${assetId}`)
		.then(response => response.json());
		console.log(res)
	return res;
};
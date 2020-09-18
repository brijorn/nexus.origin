export default function(userId: number | string, assetId: number | string) {
	const res = fetch(`http://api.roblox.com/Ownership/HasAsset?userId=${userId}&assetId=${assetId}`)
		.then(response => response.json());

	return res;
};
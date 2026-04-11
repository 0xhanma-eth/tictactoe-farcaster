/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    // Ganti HOSTED_MANIFEST_ID dengan ID dari https://farcaster.xyz/~/developers/mini-apps/manifest
    const hostedManifestId = process.env.HOSTED_MANIFEST_ID

    if (hostedManifestId) {
      return [
        {
          source: '/.well-known/farcaster.json',
          destination: `https://api.farcaster.xyz/miniapps/hosted-manifest/${hostedManifestId}`,
          permanent: false,
        },
      ]
    }
    return []
  },
}

export default nextConfig

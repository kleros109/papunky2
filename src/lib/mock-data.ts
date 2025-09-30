import type { Track } from '@/types/music';
export const mockData: Track[] = [
  {
    id: 'track-1',
    songTitle: 'Chan Chan',
    artistName: 'Buena Vista Social Club',
    broadcast: {
      artist: 'Cuban collective revived by Ry Cooder, showcasing legendary son musicians.',
      release: '1997, World Circuit/Nonesuch, from their iconic self-titled Havana sessions album.',
      fusion: 'Traditional son cubano that achieved massive global crossover success and acclaim.',
    },
    prep: {
      artistBackground: 'The Buena Vista Social Club was a project initiated by World Circuit executive Nick Gold, produced by Ry Cooder. It brought together veteran Cuban musicians, many of whom were retired, to record an album that revived pre-revolutionary Cuban music styles.',
      releaseContext: 'The self-titled album, recorded in just six days in Havana in 1996 and released in 1997, became a surprise international bestseller. It won a Grammy Award and led to a Wim Wenders documentary, further catapulting the artists to global fame.',
      globalSignificance: 'The project is a landmark in world music, responsible for a worldwide revival of interest in traditional Cuban music. It represents a powerful moment of cultural preservation meeting international exchange, inspiring a generation of musicians and listeners.',
    },
    spotifyUrl: 'https://open.spotify.com/track/3zBhihYUHBmGd2bcQIobrF',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273b9d4f6b9b4fdc7d9a3b2d2a4',
    albumTitle: 'Buena Vista Social Club',
    sources: ['AllMusic', 'Discogs', 'World Circuit Records', 'Spotify oEmbed'],
  },
  {
    id: 'track-2',
    songTitle: 'Jóga',
    artistName: 'Björk',
    broadcast: {
      artist: 'Icelandic innovator merging avant-garde classical arrangements with powerful electronic beats.',
      release: '1997, One Little Indian, a pivotal lead single from her album *Homogenic*.',
      fusion: 'A unique fusion of lush, romantic orchestral strings with gritty, UK-inspired electronic textures.',
    },
    prep: {
      artistBackground: "Björk is an Icelandic singer, songwriter, composer, and producer known for her genre-defying work that bridges pop, avant-garde, and electronica. Her expressive voice and constant innovation have made her one of music's most respected and eclectic artists.",
      releaseContext: "Released as the first single from her 1997 masterpiece *Homogenic*, 'Jóga' was co-produced with electronic artist Mark Bell. The song is dedicated to her best friend and is described by Björk as a tribute to Iceland's landscapes, with 'volcanic beats'.",
      globalSignificance: "The track is a prime example of Björk's ability to blend disparate worlds. It masterfully combines Nordic orchestral sensibilities with the cutting-edge, club-driven electronic sounds of the UK, creating a sound that was both emotionally raw and sonically futuristic, influencing countless artists.",
    },
    spotifyUrl: 'https://open.spotify.com/track/3SktMqZmo3M9zbB7oKMIF7',
    artworkUrl: 'https://i.scdn.co/image/ab67616d0000b273b2f8a73b1b0f7b5a0e9d8b4f',
    albumTitle: 'Homogenic',
    sources: ['AllMusic', 'Pitchfork', 'Discogs', 'One Little Independent', 'Spotify oEmbed'],
  },
];
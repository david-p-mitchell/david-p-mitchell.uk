// Journey stops for the map tab, keyed by person id.
// Stops are in travel order. Coordinates are approximate, and some ancient sites
// (Ur's surroundings, Midian, Mount Sinai, Mount Moriah) are traditional identifications that scholars dispute.

export interface Stop {
  place: string
  lat: number
  lng: number
  note: string
  when?: string
}

export const journeys: Record<string, Stop[]> = {
  abraham: [
    { place: 'Ur', lat: 30.9628, lng: 46.103, note: 'Abram\u2019s family set out from Ur of the Chaldeans.' },
    { place: 'Haran', lat: 36.8667, lng: 39.0333, note: 'They settled here until Terah died, then God called Abram onward.' },
    { place: 'Shechem', lat: 32.213, lng: 35.282, note: 'First stop in Canaan, where the Lord appeared and promised the land to his offspring.' },
    { place: 'Bethel', lat: 31.93, lng: 35.22, note: 'Built an altar and called on the name of the Lord.' },
    { place: 'Egypt', lat: 29.85, lng: 31.25, note: 'Went down to Egypt during a famine.' },
    { place: 'Hebron (Mamre)', lat: 31.5326, lng: 35.0998, note: 'Made his home by the oaks of Mamre. He was later buried here at Machpelah.' },
    { place: 'Beersheba', lat: 31.2518, lng: 34.7913, note: 'Planted a tamarisk tree and called on the Lord, the Everlasting God.' },
    { place: 'Mount Moriah', lat: 31.778, lng: 35.2354, note: 'Offered Isaac in obedience, and the Lord provided a ram. Traditionally identified with Jerusalem.' },
  ],

  moses: [
    { place: 'Egypt (Goshen)', lat: 30.8, lng: 31.8333, note: 'Born a Hebrew slave and raised in Pharaoh\u2019s household.' },
    { place: 'Midian', lat: 28.3, lng: 35.0, note: 'Fled here after killing an Egyptian, and tended Jethro\u2019s flocks for forty years. The exact location is debated.' },
    { place: 'Mount Sinai (traditional)', lat: 28.5392, lng: 33.975, note: 'Met God at the burning bush, and later received the Law here. The site is traditional and debated.' },
    { place: 'Kadesh Barnea', lat: 30.6, lng: 34.4, note: 'The spies were sent from here, and Israel refused to enter the land.' },
    { place: 'Mount Nebo', lat: 31.7683, lng: 35.725, note: 'Saw the Promised Land from here, and died.' },
  ],

  paul: [
    { place: 'Tarsus', lat: 36.9167, lng: 34.8917, note: 'Born here, a Roman citizen.' },
    { place: 'Jerusalem', lat: 31.7767, lng: 35.2345, note: 'Studied under Gamaliel and consented to Stephen\u2019s death.', when: 'Early life' },
    { place: 'Damascus', lat: 33.5138, lng: 36.2765, note: 'Met the risen Christ on the road and was baptised.', when: 'Conversion' },
    { place: 'Antioch (Syria)', lat: 36.2021, lng: 36.1603, note: 'Sent out with Barnabas by the church here.', when: 'First journey' },
    { place: 'Paphos', lat: 34.7556, lng: 32.4064, note: 'Confronted Elymas and the proconsul Sergius Paulus believed.', when: 'First journey' },
    { place: 'Pisidian Antioch', lat: 38.3, lng: 31.18, note: 'Preached in the synagogue and then turned to the Gentiles.', when: 'First journey' },
    { place: 'Lystra', lat: 37.5833, lng: 32.3333, note: 'Healed a lame man and was stoned and left for dead.', when: 'First journey' },
    { place: 'Philippi', lat: 41.0128, lng: 24.2872, note: 'Lydia believed, and Paul and Silas were imprisoned and freed.', when: 'Second journey' },
    { place: 'Thessalonica', lat: 40.6401, lng: 22.9444, note: 'Preached for three Sabbaths and a church was planted.', when: 'Second journey' },
    { place: 'Athens', lat: 37.9838, lng: 23.7275, note: 'Spoke to the philosophers at the Areopagus.', when: 'Second journey' },
    { place: 'Corinth', lat: 37.906, lng: 22.879, note: 'Stayed a year and a half and planted a church.', when: 'Second journey' },
    { place: 'Ephesus', lat: 37.9411, lng: 27.3417, note: 'Taught for about two years, so that all Asia heard the word.', when: 'Third journey' },
    { place: 'Caesarea', lat: 32.5, lng: 34.8917, note: 'Held in custody for two years and appealed to Caesar.', when: 'Prisoner' },
    { place: 'Rome', lat: 41.9028, lng: 12.4964, note: 'Preached under house arrest. Tradition says he was martyred here.', when: 'Prisoner' },
  ],

  luther: [
    { place: 'Eisleben', lat: 51.5278, lng: 11.5486, note: 'Born here in 1483, and died here in 1546.' },
    { place: 'Erfurt', lat: 50.9787, lng: 11.0328, note: 'Studied here, and entered the Augustinian monastery after a thunderstorm in 1505.' },
    { place: 'Rome', lat: 41.9028, lng: 12.4964, note: 'Visited the city around 1510 and was shocked by what he saw.' },
    { place: 'Wittenberg', lat: 51.8661, lng: 12.6444, note: 'Taught at the university and posted the Ninety-five Theses in 1517.' },
    { place: 'Worms', lat: 49.6319, lng: 8.3597, note: 'Refused to recant before the Emperor at the Diet in 1521.' },
    { place: 'Wartburg Castle', lat: 50.9667, lng: 10.3064, note: 'Sheltered here and translated the New Testament into German.' },
  ],

  carey: [
    { place: 'Paulerspury', lat: 52.1, lng: -0.95, note: 'Born in this Northamptonshire village and apprenticed as a shoemaker.' },
    { place: 'Leicester', lat: 52.6369, lng: -1.1398, note: 'Pastored a Baptist church here and wrote his Enquiry on missions.' },
    { place: 'Kettering', lat: 52.398, lng: -0.726, note: 'The Baptist Missionary Society was formed here in 1792.' },
    { place: 'Calcutta', lat: 22.5726, lng: 88.3639, note: 'Arrived in India in 1793.' },
    { place: 'Serampore', lat: 22.75, lng: 88.34, note: 'Settled here with Marshman and Ward, and set up a mission, a press and a college.' },
  ],
}
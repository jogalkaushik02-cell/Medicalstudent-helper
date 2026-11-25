import type { SectionId } from './types'

export interface PortalRegion {
  id: string
  name: string
  summary: string
  relations: string
  clinical: string[]
  diseases: string[]
}

export interface PortalLink {
  label: string
  href: string
  note: string
}

export interface Portal {
  id: SectionId
  name: string
  latin: string
  kicker: string
  tagline: string
  description: string
  accent: string
  regions: PortalRegion[]
  sims: PortalLink[]
  redFlags: string[]
  searchHint: string
}

export const portals: Portal[] = [
  {
    id: 'ear',
    name: 'Ear',
    latin: 'Auris',
    kicker: 'Hearing · balance',
    tagline: 'From pinna to cochlea, with the ossicles and labyrinth in between.',
    description:
      'A clickable schematic of the outer, middle and inner ear. Isolate layers, overlay common diseases, and follow sound and vestibular pathways.',
    accent: 'emerald',
    regions: [],
    sims: [
      { label: 'Audiogram simulator', href: '/simulations#audiogram', note: 'Conductive vs sensorineural patterns' },
      { label: 'BPPV / Epley simulator', href: '/simulations#bppv', note: 'Walk the otoconia through the canal' },
      { label: 'Ear explorer', href: '/ear', note: 'Clickable 3D schematic with overlays' },
    ],
    redFlags: [
      'Sudden sensorineural hearing loss is an emergency — same-day ENT review.',
      'Facial palsy with a discharging ear needs urgent assessment.',
      'Vertigo with new focal neurology is central until proven otherwise.',
      'A discharging ear that does not respond to treatment needs microsuction and ENT review.',
    ],
    searchHint: 'Try “cholesteatoma”, “BPPV”, “stapes” or “audiogram”.',
  },
  {
    id: 'nose',
    name: 'Nose',
    latin: 'Nasus',
    kicker: 'Airflow · sinuses · smell',
    tagline: 'Septum, turbinates and paranasal sinuses — the airway’s front door.',
    description:
      'An interactive lateral-wall map of the nasal cavity and sinuses. Select a region to see its relations, clinical relevance and the conditions that live there.',
    accent: 'lime',
    regions: [
      {
        id: 'septum',
        name: 'Nasal septum',
        summary:
          'The midline partition of the nasal cavity, made of cartilage anteriorly and bone posteriorly. It separates the two airways and supports the nasal dorsum.',
        relations:
          'Quadrangular cartilage anteriorly, perpendicular plate of the ethmoid superiorly, vomer posteriorly, and the maxillary crest inferiorly.',
        clinical: [
          'Deviation narrows one side and can worsen obstruction, snoring and sinus drainage.',
          'A post-traumatic boggy swelling is a septal haematoma until proven otherwise.',
          'Perforation can follow surgery, cocaine use, granulomatous disease or trauma.',
        ],
        diseases: ['epistaxis', 'nasal-septal-haematoma'],
      },
      {
        id: 'little-area',
        name: 'Little’s area',
        summary:
          'The anterior septal mucosa containing Kiesselbach’s plexus, an anastomosis of several arteries. It is the commonest site of anterior epistaxis.',
        relations:
          'Anterior ethmoidal, sphenopalatine, greater palatine and septal branches of the facial artery meet here on the anterior septum.',
        clinical: [
          'Most anterior nosebleeds stop with pressure, topical vasoconstrictor and cautery.',
          'Recurrent bleeding may need examination for a visible vessel or mucosal disease.',
        ],
        diseases: ['epistaxis'],
      },
      {
        id: 'inferior-turbinate',
        name: 'Inferior turbinate',
        summary:
          'The largest turbinate, with erectile venous tissue that conditions and humidifies inspired air. It is the main resistor of nasal airflow.',
        relations:
          'Lies on the lateral nasal wall below the middle meatus; drains into the inferior meatus via the nasolacrimal duct.',
        clinical: [
          'Hypertrophy causes persistent obstruction and can be reduced medically or surgically.',
          'Allergic rhinitis produces pale, boggy turbinates with clear discharge.',
          'Topical decongestant overuse causes rebound rhinitis medicamentosa.',
        ],
        diseases: ['allergic-rhinitis', 'acute-rhinosinusitis'],
      },
      {
        id: 'middle-turbinate',
        name: 'Middle turbinate',
        summary:
          'A landmark for endoscopic sinus surgery. It overhangs the middle meatus, where the maxillary, frontal and anterior ethmoidal sinuses drain.',
        relations:
          'The ostiomeatal complex lies lateral to it; the sphenopalatine artery passes posteriorly near its tail.',
        clinical: [
          'Middle-meatal obstruction is central to rhinosinusitis.',
          'A concha bullosa can narrow the ostiomeatal complex.',
          'The middle turbinate is a key landmark for safe sinus surgery.',
        ],
        diseases: ['acute-rhinosinusitis'],
      },
      {
        id: 'maxillary-sinus',
        name: 'Maxillary sinus',
        summary:
          'The largest paranasal sinus, pyramidal and air-filled, lying below the orbit and above the teeth. It drains through the middle meatus.',
        relations:
          'Floor is related to the maxillary molar roots; roof is the orbital floor; medial wall is the nasal cavity.',
        clinical: [
          'Dental infection can spread directly into the sinus.',
          'Orbital complications present with swelling, proptosis or visual change.',
          'Fluid levels on imaging support acute sinusitis but are not required for diagnosis.',
        ],
        diseases: ['acute-rhinosinusitis'],
      },
      {
        id: 'frontal-sinus',
        name: 'Frontal sinus',
        summary:
          'A paired sinus in the frontal bone that drains through the frontonasal duct into the middle meatus. Its drainage pathway is narrow and easily obstructed.',
        relations:
          'Posterior table separates it from the anterior cranial fossa; floor separates it from the orbit.',
        clinical: [
          'Frontal sinusitis can spread to the orbit or intracranial compartment.',
          'Pott’s puffy tumour is frontal osteomyelitis with a subperiosteal abscess.',
        ],
        diseases: ['acute-rhinosinusitis'],
      },
      {
        id: 'sphenoid-sinus',
        name: 'Sphenoid sinus',
        summary:
          'A central sinus within the sphenoid bone, closely related to the pituitary fossa and cavernous sinuses. It drains into the sphenoethmoidal recess.',
        relations:
          'Roof is the sella; lateral walls are the cavernous sinuses; anterior wall faces the nasal cavity.',
        clinical: [
          'Sphenoid disease can present with deep headache or retro-orbital pain.',
          'Surgery risks injury to the internal carotid artery and optic nerve.',
        ],
        diseases: ['acute-rhinosinusitis'],
      },
      {
        id: 'nasopharynx',
        name: 'Nasopharynx',
        summary:
          'The airway behind the nasal cavity, above the soft palate. It contains the adenoids and the Eustachian tube openings.',
        relations:
          'Communicates with the nasal cavity anteriorly, the oropharynx below and the middle ear via the Eustachian tube.',
        clinical: [
          'Adenoidal hypertrophy obstructs the nose and causes mouth breathing in children.',
          'A unilateral persistent mass in an adult needs nasopharyngeal examination.',
        ],
        diseases: ['obstructive-sleep-apnoea'],
      },
    ],
    sims: [
      { label: 'Allergic rhinitis', href: '/diseases/allergic-rhinitis', note: 'IgE, turbinates and the allergic salute' },
      { label: 'Acute rhinosinusitis', href: '/diseases/acute-rhinosinusitis', note: 'When a cold becomes bacterial' },
      { label: 'Epistaxis', href: '/diseases/epistaxis', note: 'Anterior vs posterior bleeding' },
    ],
    redFlags: [
      'Unilateral bloody nasal discharge in an adult needs endoscopic examination.',
      'Periorbital swelling, proptosis or visual loss with sinusitis is an orbital emergency.',
      'Severe headache, neck stiffness or focal neurology suggests intracranial spread.',
      'Posterior bleeding with airway compromise needs urgent packing and ENT support.',
    ],
    searchHint: 'Try “sinusitis”, “epistaxis”, “turbinate” or “septal haematoma”.',
  },
  {
    id: 'pharynx',
    name: 'Pharynx',
    latin: 'Pharynx',
    kicker: 'Swallow · speech · sleep',
    tagline: 'A muscular crossroads shared by air and food.',
    description:
      'Explore the nasopharynx, oropharynx and hypopharynx, the tonsils and the soft palate. Link each region to infection, obstruction and airway risk.',
    accent: 'gold',
    regions: [
      {
        id: 'nasopharynx',
        name: 'Nasopharynx',
        summary:
          'The uppermost pharynx, behind the nasal cavity and above the soft palate. It is lined by respiratory epithelium and contains the adenoids.',
        relations:
          'Anteriorly the choanae, laterally the Eustachian tube orifices and fossa of Rosenmüller, inferiorly the soft palate.',
        clinical: [
          'Adenoidal hypertrophy causes nasal obstruction, snoring and otitis media with effusion.',
          'The fossa of Rosenmüller is a common site for nasopharyngeal carcinoma.',
        ],
        diseases: ['obstructive-sleep-apnoea', 'acute-rhinosinusitis'],
      },
      {
        id: 'adenoid',
        name: 'Adenoid',
        summary:
          'Nasopharyngeal lymphoid tissue that is largest in early childhood and usually involutes by adolescence. It is part of Waldeyer’s ring.',
        relations:
          'Sits on the posterior nasopharyngeal wall, close to the Eustachian tube openings.',
        clinical: [
          'Enlargement causes mouth breathing, snoring and sleep-disordered breathing.',
          'It can block the Eustachian tube and cause glue ear.',
          'Adenoidectomy is considered for obstruction or recurrent otitis media.',
        ],
        diseases: ['obstructive-sleep-apnoea'],
      },
      {
        id: 'oropharynx',
        name: 'Oropharynx',
        summary:
          'The middle pharynx behind the oral cavity, between the soft palate and the epiglottis. It contains the palatine tonsils and the base of tongue.',
        relations:
          'Anteriorly the oral cavity, laterally the tonsillar pillars, inferiorly the hypopharynx.',
        clinical: [
          'Most acute sore throats are viral; exudate alone does not prove bacterial infection.',
          'Trismus and uvular deviation suggest a peritonsillar collection.',
        ],
        diseases: ['acute-tonsillitis', 'peritonsillar-abscess'],
      },
      {
        id: 'palatine-tonsil',
        name: 'Palatine tonsil',
        summary:
          'A paired lymphoid organ in the tonsillar fossa between the palatoglossal and palatopharyngeal arches. It samples inhaled and ingested antigens.',
        relations:
          'Lies between the pillars, with the internal carotid artery about 2–3 cm posterolateral.',
        clinical: [
          'Acute tonsillitis causes sore throat, fever and tender cervical nodes.',
          'Peritonsillar abscess causes unilateral bulging, trismus and a muffled voice.',
          'Tonsillectomy is considered for recurrent severe tonsillitis or obstruction.',
        ],
        diseases: ['acute-tonsillitis', 'peritonsillar-abscess'],
      },
      {
        id: 'soft-palate',
        name: 'Soft palate',
        summary:
          'The muscular posterior palate that seals the nasopharynx during swallowing and speech. The uvula hangs from its free edge.',
        relations:
          'Attached to the hard palate anteriorly and the pharyngeal wall laterally; moves with the palatal muscles.',
        clinical: [
          'Uvular deviation away from a peritonsillar abscess is a classic sign.',
          'Palatal weakness causes nasal regurgitation and hypernasal speech.',
        ],
        diseases: ['peritonsillar-abscess', 'acute-tonsillitis'],
      },
      {
        id: 'hypopharynx',
        name: 'Hypopharynx',
        summary:
          'The lower pharynx, from the epiglottis to the oesophagus. It includes the pyriform sinuses and the postcricoid region.',
        relations:
          'Anteriorly the larynx, inferiorly the oesophagus, laterally the pyriform fossae.',
        clinical: [
          'Dysphagia, odynophagia and weight loss in an older adult need urgent endoscopy.',
          'Pyriform fossa and postcricoid tumours can be subtle.',
        ],
        diseases: ['vocal-cord-palsy'],
      },
      {
        id: 'epiglottis',
        name: 'Epiglottis',
        summary:
          'A cartilaginous flap that folds over the laryngeal inlet during swallowing to protect the airway.',
        relations:
          'Attached to the hyoid and thyroid cartilage; anterior to the laryngeal inlet.',
        clinical: [
          'Epiglottitis causes fever, drooling, muffled voice and rapid airway obstruction.',
          'Do not examine the throat forcefully in a child with suspected epiglottitis.',
        ],
        diseases: ['croup', 'acute-laryngitis'],
      },
      {
        id: 'retropharyngeal-space',
        name: 'Retropharyngeal space',
        summary:
          'A potential space between the pharynx and the prevertebral fascia, extending from the skull base to the mediastinum.',
        relations:
          'Anterior to the prevertebral muscles; communicates with the danger space and mediastinum.',
        clinical: [
          'Infection can spread to the mediastinum and is a deep neck space emergency.',
          'Children with retropharyngeal abscess may hold the neck extended and refuse to swallow.',
        ],
        diseases: ['peritonsillar-abscess'],
      },
    ],
    sims: [
      { label: 'Airway narrowing simulator', href: '/simulations#airway', note: 'See how calibre changes stridor and voice' },
      { label: 'Peritonsillar abscess case', href: '/cases?case=case-quinsy', note: 'Trismus, uvular deviation and drainage' },
      { label: 'Tonsillitis', href: '/diseases/acute-tonsillitis', note: 'Viral vs streptococcal infection' },
    ],
    redFlags: [
      'Stridor, drooling or inability to swallow saliva is an airway emergency.',
      'Trismus with unilateral swelling suggests a peritonsillar or deep neck collection.',
      'A muffled “hot potato” voice needs urgent examination.',
      'Neck stiffness, torticollis or systemic toxicity suggests retropharyngeal spread.',
    ],
    searchHint: 'Try “quinsy”, “tonsillitis”, “adenoid” or “sleep apnoea”.',
  },
  {
    id: 'larynx',
    name: 'Larynx',
    latin: 'Larynx',
    kicker: 'Voice · airway · swallow',
    tagline: 'The valve that protects the airway and makes the voice.',
    description:
      'A coronal map of the larynx: epiglottis, vocal cords, arytenoids, subglottis and cricothyroid membrane. Use the airway simulator to see how narrowing changes stridor.',
    accent: 'violet',
    regions: [
      {
        id: 'epiglottis',
        name: 'Epiglottis',
        summary:
          'The leaf-shaped supraglottic cartilage that closes the laryngeal inlet during swallowing.',
        relations:
          'Anterior to the laryngeal vestibule; attached to the hyoid and thyroid cartilage.',
        clinical: [
          'Epiglottitis is a rapid airway emergency with drooling and tripod positioning.',
          'Keep the child calm and involve anaesthesia early.',
        ],
        diseases: ['croup', 'acute-laryngitis'],
      },
      {
        id: 'false-cords',
        name: 'False vocal cords',
        summary:
          'The vestibular folds above the true cords. They are not the main vibrating structures but can close the airway.',
        relations:
          'Lie superior to the true cords and lateral to the laryngeal ventricle.',
        clinical: [
          'Supraglottic inflammation can obstruct the airway above the glottis.',
          'Vestibular fold swelling contributes to stridor in supraglottitis.',
        ],
        diseases: ['acute-laryngitis'],
      },
      {
        id: 'true-cords',
        name: 'True vocal cords',
        summary:
          'The paired mucosal folds that vibrate to produce voice. Their position and tension are controlled by the intrinsic laryngeal muscles.',
        relations:
          'Attach anteriorly to the thyroid cartilage and posteriorly to the arytenoids; the glottis is the gap between them.',
        clinical: [
          'Hoarseness is the cardinal sign of vocal cord pathology.',
          'Persistent hoarseness in a smoker needs laryngoscopy to exclude malignancy.',
          'Bilateral palsy can cause stridor; unilateral palsy causes a breathy voice.',
        ],
        diseases: ['acute-laryngitis', 'vocal-cord-palsy'],
      },
      {
        id: 'arytenoids',
        name: 'Arytenoids',
        summary:
          'Paired cartilages that pivot on the cricoid and move the vocal cords. They open the glottis for breathing and close it for voice and swallowing.',
        relations:
          'Sit on the posterior cricoid; the posterior cricoarytenoid is the only abductor of the cords.',
        clinical: [
          'Arytenoid dislocation can follow intubation and cause persistent hoarseness.',
          'Posterior glottic narrowing is a cause of bilateral vocal cord palsy.',
        ],
        diseases: ['vocal-cord-palsy'],
      },
      {
        id: 'subglottis',
        name: 'Subglottis',
        summary:
          'The airway below the true cords, enclosed by the rigid cricoid ring. It is the narrowest part of the paediatric airway.',
        relations:
          'Extends from the glottis to the lower border of the cricoid cartilage.',
        clinical: [
          'Subglottic oedema causes the barking cough and stridor of croup.',
          'Prolonged intubation can cause subglottic stenosis.',
        ],
        diseases: ['croup'],
      },
      {
        id: 'thyroid-cartilage',
        name: 'Thyroid cartilage',
        summary:
          'The largest laryngeal cartilage, forming the laryngeal prominence and protecting the anterior larynx.',
        relations:
          'Articulates with the cricoid below and the hyoid above; the vocal cords attach to its inner surface.',
        clinical: [
          'The laryngeal prominence is larger in post-pubertal males.',
          'Fractures after blunt neck trauma can compromise the airway.',
        ],
        diseases: ['acute-laryngitis'],
      },
      {
        id: 'cricothyroid-membrane',
        name: 'Cricothyroid membrane',
        summary:
          'The membrane between the thyroid and cricoid cartilages. It is the standard site for emergency front-of-neck airway access.',
        relations:
          'Palpable in the midline below the laryngeal prominence; overlies the airway just above the cricoid ring.',
        clinical: [
          'Cricothyroidotomy is a rescue airway when intubation fails.',
          'Landmark identification is harder in obesity or neck trauma.',
        ],
        diseases: ['croup', 'vocal-cord-palsy'],
      },
      {
        id: 'trachea',
        name: 'Trachea',
        summary:
          'The cartilaginous airway below the larynx, lined by ciliated respiratory epithelium and divided into the main bronchi.',
        relations:
          'Begins below the cricoid at C6 and bifurcates at the carina around T4–T5.',
        clinical: [
          'Tracheal narrowing causes stridor and effort-dependent distress.',
          'The carina is a key landmark for suctioning and bronchoscopy.',
        ],
        diseases: ['croup'],
      },
    ],
    sims: [
      { label: 'Airway narrowing simulator', href: '/simulations#airway', note: 'Calibre, stridor and voice' },
      { label: 'Croup case', href: '/cases?case=case-croup', note: 'Barking cough in a toddler' },
      { label: 'Vocal cord palsy', href: '/diseases/vocal-cord-palsy', note: 'Recurrent laryngeal nerve anatomy' },
    ],
    redFlags: [
      'Stridor at rest is an airway emergency until assessed.',
      'Drooling, tripod positioning or silent chest suggests critical obstruction.',
      'Hoarseness lasting more than three weeks needs laryngoscopy.',
      'Blunt neck trauma with voice change or subcutaneous emphysema needs urgent imaging.',
    ],
    searchHint: 'Try “croup”, “hoarseness”, “stridor” or “vocal cord”.',
  },
  {
    id: 'eye',
    name: 'Eye',
    latin: 'Oculus',
    kicker: 'Vision · pupil · retina',
    tagline: 'Globe, anterior segment, retina and optic nerve in one model.',
    description:
      'A clickable globe with lens-opacity and pupil controls, plus disease overlays. Follow the visual pathway and test field defects.',
    accent: 'cyan',
    regions: [],
    sims: [
      { label: 'Cataract vision simulator', href: '/simulations#cataract', note: 'Clouding, glare and contrast loss' },
      { label: 'Glaucoma disc simulator', href: '/simulations#glaucoma', note: 'Cupping and arcuate field loss' },
      { label: 'Visual field localiser', href: '/pathways/visual', note: 'Prechiasmal, chiasmal and postchiasmal lesions' },
    ],
    redFlags: [
      'Sudden painless visual loss needs same-day assessment.',
      'A painful red eye with a fixed pupil suggests acute angle closure.',
      'Visual loss with a relative afferent pupillary defect suggests optic nerve disease.',
      'A curtain or flashes and floaters suggest retinal detachment.',
    ],
    searchHint: 'Try “glaucoma”, “cataract”, “RAPD” or “visual field”.',
  },
]

export const portalsById = Object.fromEntries(portals.map((portal) => [portal.id, portal]))

export const sectionLabel: Record<SectionId, string> = {
  ear: 'Ear',
  nose: 'Nose',
  pharynx: 'Pharynx',
  larynx: 'Larynx',
  eye: 'Eye',
}

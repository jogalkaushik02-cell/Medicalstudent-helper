import type { Pathway } from './types'

export const pathways: Pathway[] = [
  {
    id: 'visual',
    name: 'Visual pathway',
    system: 'eye',
    tagline: 'Retina → chiasm → cortex',
    summary:
      'The right hemisphere sees the left visual field. Nasal retinal fibres cross at the chiasm; everything after the chiasm carries the contralateral field. Lesion localisation is mostly about where the crossing happens and which radiation is hit.',
    steps: [
      {
        id: 'retina',
        label: 'Retina',
        detail:
          'Photoreceptors → bipolar cells → ganglion cells. Nasal retinal fibres will cross; temporal fibres stay ipsilateral. The macula has the highest acuity and a wide cortical representation.',
        lesion: 'A retinal lesion causes a monocular field defect respecting the horizontal meridian (e.g. branch retinal artery occlusion).',
      },
      {
        id: 'optic-nerve',
        label: 'Optic nerve',
        detail:
          'Carries all fibres from one eye through the optic canal. A lesion here is prechiasmal and therefore monocular.',
        lesion: 'Right optic nerve → right eye blind, with a right relative afferent pupillary defect.',
      },
      {
        id: 'chiasm',
        label: 'Optic chiasm',
        detail:
          'Nasal fibres from each eye cross; temporal fibres remain ipsilateral. The chiasm sits above the pituitary and between the internal carotid arteries.',
        lesion: 'Central chiasm lesion → bitemporal hemianopia (pituitary adenoma is classic). Lateral compression can cause binasal defects.',
      },
      {
        id: 'optic-tract',
        label: 'Optic tract',
        detail:
          'Carries the contralateral visual field from both eyes. Runs around the cerebral peduncle to the lateral geniculate nucleus.',
        lesion: 'Right optic tract → left homonymous hemianopia, often incongruous.',
      },
      {
        id: 'lgn',
        label: 'Lateral geniculate nucleus',
        detail:
          'Thalamic relay with six layers, segregated by eye and receptive-field type. Projects via the optic radiations.',
        lesion: 'LGN lesion → contralateral homonymous hemianopia (often congruent).',
      },
      {
        id: 'meyer',
        label: 'Meyer loop (temporal lobe)',
        detail:
          'Inferior retinal fibres loop forward into the temporal lobe before running posteriorly. Inferior retina = superior visual field.',
        lesion: 'Right Meyer loop → left superior quadrantanopia (“pie in the sky”).',
      },
      {
        id: 'parietal',
        label: 'Parietal radiation (Baumgarten)',
        detail:
          'Superior retinal fibres run through the parietal lobe. Superior retina = inferior visual field.',
        lesion: 'Right parietal radiation → left inferior quadrantanopia.',
      },
      {
        id: 'occipital',
        label: 'Occipital cortex',
        detail:
          'Primary visual cortex at the occipital pole, with the macula represented at the pole and a dual blood supply from the MCA and PCA.',
        lesion: 'Right occipital cortex → left homonymous hemianopia with macular sparing.',
      },
    ],
    notes: [
      'Before the chiasm = monocular. At the chiasm = bitemporal. After the chiasm = contralateral homonymous.',
      'Temporal lobe = superior field. Parietal lobe = inferior field.',
      'Macular sparing is typical of occipital lesions because the occipital pole has dual blood supply.',
      'A relative afferent pupillary defect is a sign of optic nerve disease, not a field defect.',
    ],
    structures: ['retina', 'optic-nerve', 'visual-pathway', 'pupillary-pathway'],
    tags: ['hemianopia', 'quadrantanopia', 'chiasm', 'Meyer', 'macular sparing'],
  },
  {
    id: 'auditory',
    name: 'Auditory pathway',
    system: 'ear',
    tagline: 'Cochlea → brainstem → cortex',
    summary:
      'Auditory information crosses at several levels after the cochlear nuclei, so unilateral central lesions rarely cause deafness. Conductive loss is a middle-ear problem; sensorineural loss is cochlear or neural.',
    steps: [
      {
        id: 'cochlea',
        label: 'Cochlea / organ of Corti',
        detail:
          'Inner hair cells synapse with spiral ganglion cells. Tonotopy: base = high frequency, apex = low frequency.',
        lesion: 'Cochlear hair-cell loss → sensorineural loss, often with recruitment and tinnitus.',
      },
      {
        id: 'cochlear-nerve',
        label: 'Cochlear nerve (CN VIII)',
        detail:
          'Axons pass through the modiolus and internal auditory canal to the pontomedullary junction.',
        lesion: 'Vestibular schwannoma → unilateral sensorineural loss and tinnitus.',
      },
      {
        id: 'cochlear-nuclei',
        label: 'Cochlear nuclei',
        detail:
          'Located at the pontomedullary junction. Second-order neurons project bilaterally to the superior olivary complex.',
        lesion: 'Unilateral lesion can cause subtle difficulty with sound localisation, not deafness.',
      },
      {
        id: 'superior-olivary',
        label: 'Superior olivary complex',
        detail:
          'The first major binaural comparison; important for localising sound in space.',
        lesion: 'Lesions affect localisation and binaural processing more than pure thresholds.',
      },
      {
        id: 'lateral-lemniscus',
        label: 'Lateral lemniscus',
        detail: 'Ascending fibres in the brainstem, carrying information to the inferior colliculus.',
        lesion: 'Central lesions rarely cause profound hearing loss because of bilateral representation.',
      },
      {
        id: 'inferior-colliculus',
        label: 'Inferior colliculus',
        detail: 'Midbrain relay and integration centre; also involved in the startle reflex.',
        lesion: 'May cause auditory processing difficulties; not deafness.',
      },
      {
        id: 'mgn',
        label: 'Medial geniculate nucleus',
        detail: 'Thalamic relay to the auditory cortex.',
        lesion: 'Rarely causes isolated deafness; central auditory processing deficit.',
      },
      {
        id: 'auditory-cortex',
        label: 'Auditory cortex',
        detail:
          'Heschl’s gyrus in the superior temporal lobe; tonotopic and hierarchical processing.',
        lesion: 'Cortical lesions can impair speech perception and sound localisation; unilateral lesions do not cause deafness.',
      },
    ],
    notes: [
      'Conductive loss: outer or middle ear; bone conduction better than air conduction.',
      'Sensorineural loss: cochlea or CN VIII; air and bone conduction are both reduced.',
      'Above the cochlear nuclei, bilateral pathways make unilateral deafness unusual.',
      'Sudden unilateral sensorineural loss is an emergency — start steroids and image the IAC.',
    ],
    structures: ['cochlea', 'auditory-nerve', 'internal-auditory-canal'],
    tags: ['hearing', 'brainstem', 'cochlear nuclei', 'sensorineural', 'conductive'],
  },
  {
    id: 'facial',
    name: 'Facial nerve',
    system: 'ear',
    tagline: 'Cortex → parotid, with branches',
    summary:
      'The facial nerve has a long intratemporal course and a characteristic set of branch-related deficits. The single most important bedside distinction is upper motor neuron (forehead spared) versus lower motor neuron (forehead involved).',
    steps: [
      {
        id: 'cortex',
        label: 'Motor cortex / UMN',
        detail:
          'The upper face receives bilateral cortical input; the lower face receives mainly contralateral input.',
        lesion: 'UMN lesion → contralateral lower facial weakness with forehead sparing (stroke).',
      },
      {
        id: 'facial-nucleus',
        label: 'Facial nucleus (pons)',
        detail: 'Lower motor neuron cell bodies; fibres loop around the abducens nucleus (facial colliculus).',
        lesion: 'Nuclear lesion → ipsilateral LMN palsy; may accompany CN VI palsy (pontine lesion).',
      },
      {
        id: 'cpa',
        label: 'CPA / internal auditory canal',
        detail: 'CN VII travels with CN VIII; lesions here often affect hearing and balance too.',
        lesion: 'Acoustic neuroma → facial palsy with ipsilateral SNHL and vestibular symptoms.',
      },
      {
        id: 'labyrinthine',
        label: 'Labyrinthine segment / geniculate ganglion',
        detail: 'Gives the greater petrosal nerve (lacrimal, nasal glands) and the nerve to stapedius shortly after.',
        lesion: 'Lesion here → LMN palsy + dry eye + hyperacusis + taste loss.',
      },
      {
        id: 'tympanic',
        label: 'Tympanic segment',
        detail: 'Runs above the oval window on the medial wall of the middle ear.',
        lesion: 'Cholesteatoma or surgical trauma → facial palsy; risk in stapes surgery.',
      },
      {
        id: 'mastoid',
        label: 'Mastoid segment',
        detail: 'Gives the nerve to stapedius and the chorda tympani before exiting.',
        lesion: 'Lesion below the stapedius → taste loss but no hyperacusis; below chorda → isolated motor palsy.',
      },
      {
        id: 'stylomastoid',
        label: 'Stylomastoid foramen',
        detail: 'Exits the skull; supplies posterior auricular, digastric and stylohyoid branches.',
        lesion: 'Bell’s palsy is typically here — whole ipsilateral face, taste may be affected.',
      },
      {
        id: 'parotid',
        label: 'Parotid plexus',
        detail: 'Divides into temporal, zygomatic, buccal, marginal mandibular and cervical branches.',
        lesion: 'Parotid tumour or surgery → isolated branch weakness, e.g. marginal mandibular palsy.',
      },
    ],
    notes: [
      'Forehead involvement = LMN = CN VII. Forehead sparing = UMN = stroke until proven otherwise.',
      'Bell’s palsy is a diagnosis of exclusion; vesicles mean Ramsay Hunt.',
      'The eye is the emergency: lagophthalmos can cause exposure keratopathy.',
      'Steroids are most effective within 72 hours of onset.',
    ],
    structures: ['facial-nerve', 'internal-auditory-canal', 'chorda-tympani'],
    tags: ['CN VII', 'Bell', 'UMN', 'LMN', 'chorda tympani', 'Ramsay Hunt'],
  },
  {
    id: 'pupillary',
    name: 'Pupillary pathway',
    system: 'eye',
    tagline: 'Light in, both pupils out',
    summary:
      'The afferent limb is the optic nerve; the efferent limb is CN III. The pretectal nucleus projects bilaterally, which is why a light in one eye constricts both. Sympathetic fibres dilate the pupil and are tested by the reverse Horner protocol.',
    steps: [
      {
        id: 'retina',
        label: 'Retina / ganglion cells',
        detail: 'Intrinsically photosensitive ganglion cells and rod/cone pathways project to the pretectal area.',
        lesion: 'Extensive retinal disease can reduce the light reflex and cause an RAPD.',
      },
      {
        id: 'afferent',
        label: 'Optic nerve → chiasm → tract',
        detail: 'The afferent signal travels with the visual fibres; a lesion before the chiasm is monocular.',
        lesion: 'Optic neuritis → RAPD and painful visual loss.',
      },
      {
        id: 'pretectal',
        label: 'Pretectal nucleus',
        detail: 'Projects bilaterally to both Edinger–Westphal nuclei, producing the consensual reflex.',
        lesion: 'Dorsal midbrain lesion → light-near dissociation (Parinaud syndrome).',
      },
      {
        id: 'ew',
        label: 'Edinger–Westphal nucleus',
        detail: 'Parasympathetic nucleus of CN III; fibres travel with the oculomotor nerve.',
        lesion: 'CN III lesion → dilated pupil, ptosis and ophthalmoplegia.',
      },
      {
        id: 'ciliary-ganglion',
        label: 'Ciliary ganglion',
        detail: 'Synapse for parasympathetic fibres; short ciliary nerves enter the globe.',
        lesion: 'Adie pupil: tonic, large pupil with denervation supersensitivity.',
      },
      {
        id: 'sphincter',
        label: 'Sphincter pupillae',
        detail: 'Constricts the pupil; opposed by the sympathetically innervated dilator.',
        lesion: 'Trauma or topical drugs can cause a fixed pupil.',
      },
      {
        id: 'sympathetic',
        label: 'Sympathetic pathway',
        detail:
          'Hypothalamus → ciliospinal centre (C8–T2) → superior cervical ganglion → internal carotid plexus → V1 → dilator pupillae.',
        lesion: 'Horner syndrome: ptosis, miosis, anhidrosis; painful Horner suggests carotid dissection.',
      },
    ],
    notes: [
      'RAPD is an afferent defect: the affected eye dilates when the light swings to it.',
      'Horner is an efferent sympathetic defect: ptosis + miosis ± anhidrosis.',
      'Light-near dissociation means the near response is preserved while the light reflex is lost.',
      'Always check both pupils, both eyes and the swinging flashlight test.',
    ],
    structures: ['iris-pupil', 'pupillary-pathway', 'optic-nerve'],
    tags: ['RAPD', 'Horner', 'light reflex', 'Adie', 'Parinaud'],
  },
]

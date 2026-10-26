/* Metari Government: editable page data.
   Everything here is illustrative. No record below is a real program, customer, result or solicitation.
   SOURCES is the public-source registry for the "Research context" section. Re-verify each entry
   before relying on it externally and update `checked` when you do. Keep deadlines out of this file. */
window.GOV = {
  SOURCES: [
    {
      org: 'NIST',
      title: 'Humanoid Robot Baseline Performance Benchmark',
      kind: 'Benchmark and test-method research',
      sourceDate: 'Updated May 15, 2026',
      checked: 'October 25, 2026',
      url: 'https://www.nist.gov/el/intelligent-systems-division-73500/humanoid-robot-baseline-performance-benchmark',
      note: 'A proposed set of locomotion and manipulation tasks with measurable metrics for comparing humanoid capability. NIST has asked interested parties whether they would serve as participating test facilities.',
      related: { title: 'Physical AI and Data Generation for Robotics', sourceDate: 'Updated April 24, 2026', url: 'https://www.nist.gov/programs-projects/physical-ai-and-data-generation-robotics' }
    },
    {
      org: 'ERDC / CERL',
      title: 'Construction Engineering Research Laboratory Commercial Solutions Opening',
      kind: 'Published research interest and a potential competitive route',
      sourceDate: 'Solicitation file dated December 19, 2025',
      checked: 'October 25, 2026',
      url: 'https://www.erdcwerx.org/construction-engineering-research-laboratory-cso/',
      note: 'Lists robotics for engineering operations and infrastructure inspection systems among its areas of interest. A competitive route, not a standing purchase, and broad areas generally carry no specific funding.'
    },
    {
      org: 'U.S. Department of Energy',
      title: 'DOE Announces Four National Laboratory-Led Selections to Advance Robotics and Automation for Autonomous Scientific Discovery',
      kind: 'Laboratory robotics testbeds',
      sourceDate: 'October 8, 2026',
      checked: 'October 25, 2026',
      url: 'https://www.energy.gov/science/articles/doe-announces-four-national-laboratory-led-selections-advance-robotics-and',
      note: 'Four laboratory-led projects on reusable robotics capability and evaluation, selected for award negotiation. The program calls for industry participation tied to laboratory-science missions.'
    }
  ],

  /* Variables: options are [label, specText]. The last layout option is reserved for held-out evaluation. */
  SCENARIOS: {
    restock: {
      tab: 'Supply restocking',
      id: 'GOV-DEMO-001',
      name: 'Illustrative supply-restocking program',
      code: 'SR',
      partner: false,
      task: 'Collect a supply tote from the cart, traverse the service corridor and place it at the defined restock location.',
      success: [
        'Tote released fully inside the marked restock bay on the specified shelf',
        'No contact with the doorframe, shelving or the human zone beyond the agreed tolerance',
        'Interventions recorded by type and time, never removed from the record',
        'Elapsed time recorded from pickup to release'
      ],
      env: 'Service corridor with one doorway, two-bay steel shelving and a supply cart',
      expert: 'A logistics operator demonstrates the full task in each training configuration. Demonstrations are reviewed before they are accepted.',
      capture: ['Fixed RGB: two ceiling cameras, one wall camera', 'Operator egocentric video, if agreed', 'Depth at the shelf, if agreed', 'Robot telemetry only where available and authorized'],
      test: ['Robot starts inside its marked zone', 'Evaluator stays outside the marked human boundary', 'Any entry into the human zone stops the trial', 'Interventions allowed: see assistance mode'],
      dims: ['Task completion', 'Human interventions', 'Contact events', 'Elapsed time', 'Configuration-specific failures'],
      vars: {
        layout: { label: 'Doorway geometry', opts: [['Standard doorway', 'standard doorway'], ['Narrow doorway', 'narrow doorway'], ['Offset doorway', 'offset doorway']] },
        object: { label: 'Shelf position', opts: [['Middle shelf', 'middle shelf target'], ['Top shelf', 'top shelf target'], ['Bottom shelf', 'bottom shelf target']] },
        clutter: { label: 'Clutter', opts: [['Clear', 'clear aisle'], ['Moderate', 'moderate clutter'], ['Dense', 'dense clutter']] },
        lighting: { label: 'Lighting', opts: [['Even', 'even lighting'], ['Dim', 'dim lighting'], ['Glare', 'glare at the shelf']] },
        assist: { label: 'Assistance mode', opts: [['None', 'no assistance'], ['Verbal cue', 'verbal cue allowed'], ['Teleop recovery', 'teleoperated recovery allowed']] }
      }
    },
    maintenance: {
      tab: 'Maintenance tool handling',
      id: 'GOV-DEMO-002',
      name: 'Illustrative maintenance tool-handling program',
      code: 'MT',
      partner: false,
      task: 'Select the specified wrench from the pegboard, carry it to the de-energized training panel and place it on the marked tool pad.',
      success: [
        'Correct tool selected on the first attempt',
        'Tool placed inside the marked pad, oriented as specified',
        'Arm stays outside the human zone while a technician is at the bench',
        'Interventions and regrasps recorded by type'
      ],
      env: 'Steel workbench, pegboard of hand tools and a de-energized training panel',
      expert: 'A maintenance technician demonstrates tool selection and placement in each training configuration, with narration if agreed.',
      capture: ['Fixed RGB: one wall camera, one ceiling camera', 'Technician egocentric video, if agreed', 'Close view of the pegboard', 'Robot telemetry only where available and authorized'],
      test: ['Training equipment only, de-energized', 'Robot starts at the marked bench position', 'Technician inside the bench zone pauses the trial', 'Interventions allowed: see assistance mode'],
      dims: ['Task completion', 'Correct tool selection', 'Human interventions', 'Contact events', 'Elapsed time'],
      vars: {
        layout: { label: 'Bench layout', opts: [['Layout A', 'bench layout A'], ['Layout A, panel left', 'bench layout A with the panel on the left'], ['Layout B (mirrored)', 'mirrored bench layout B']] },
        object: { label: 'Tool position', opts: [['Eye level', 'target tool at eye level'], ['Low row', 'target tool on the low row'], ['Among similar tools', 'target tool among similar tools']] },
        clutter: { label: 'Bench clutter', opts: [['Clear', 'clear bench'], ['Moderate', 'moderate bench clutter'], ['Dense', 'dense bench clutter']] },
        lighting: { label: 'Lighting', opts: [['Task light', 'task lighting'], ['Overhead only', 'overhead lighting only'], ['Dim', 'dim lighting']] },
        assist: { label: 'Assistance mode', opts: [['None', 'no assistance'], ['Verbal cue', 'verbal cue allowed'], ['Teleop recovery', 'teleoperated recovery allowed']] }
      }
    },
    inspection: {
      tab: 'Constrained-access inspection',
      id: 'GOV-DEMO-003',
      name: 'Illustrative constrained-access inspection concept',
      code: 'IN',
      partner: true,
      task: 'Advance a partner-supplied inspection platform through the access hatch, capture views of three marked mock valves and return to the hatch.',
      success: [
        'All three markers captured in focus from the agreed angles',
        'No contact with mock pipework beyond the agreed tolerance',
        'Platform returns to the hatch without a physical reset',
        'Operator takeovers recorded with time and reason'
      ],
      env: 'Nonhazardous plywood and steel mock-up: corridor constraint, access hatch, painted mock pipework',
      expert: 'A partner inspection specialist demonstrates the route and the marker views. Metari configures and instruments the mock-up.',
      capture: ['Fixed RGB: hall camera and hatch camera', 'Platform camera feed, if the partner provides it', 'Marker reference photos for each configuration', 'Platform telemetry only where available and authorized'],
      test: ['Mock-up is clean, dry and de-energized', 'Partner operator present for every trial', 'Platform supplied and maintained by the partner', 'Interventions allowed: see assistance mode'],
      dims: ['Markers captured', 'Operator takeovers', 'Contact events', 'Elapsed time', 'Configuration-specific failures'],
      vars: {
        layout: { label: 'Corridor constraint', opts: [['Wide', 'wide corridor'], ['Narrow', 'narrow corridor'], ['Narrow with turn', 'narrow corridor with a turn']] },
        object: { label: 'Marker set', opts: [['Set 1', 'marker set 1'], ['Set 2', 'marker set 2'], ['Set 3', 'marker set 3']] },
        clutter: { label: 'Obstructions', opts: [['None', 'no obstructions'], ['Cable run', 'a mock cable run'], ['Cable run + debris', 'a mock cable run and debris']] },
        lighting: { label: 'Lighting', opts: [['Even', 'even lighting'], ['Low', 'low lighting'], ['Platform light only', 'platform light only']] },
        assist: { label: 'Assistance mode', opts: [['Operator teleop', 'operator teleoperation'], ['Supervised autonomy', 'supervised autonomy'], ['Autonomous', 'autonomous with operator standby']] }
      }
    }
  }
};

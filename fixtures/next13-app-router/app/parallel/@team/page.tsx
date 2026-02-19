// Parallel route slot: @team
// The @ prefix indicates this is a parallel route slot

async function getTeamData() {
  // Simulate async data fetch
  await new Promise((resolve) => setTimeout(resolve, 500));

  return [
    { id: 1, name: 'Alice Johnson', role: 'Frontend Developer' },
    { id: 2, name: 'Bob Smith', role: 'Backend Developer' },
    { id: 3, name: 'Carol White', role: 'Designer' },
  ];
}

export default async function TeamSlot() {
  const team = await getTeamData();

  return (
    <div className="card">
      <h3>Team Members</h3>
      <ul className="team-list">
        {team.map((member) => (
          <li key={member.id} className="team-member">
            <strong>{member.name}</strong>
            <span>{member.role}</span>
          </li>
        ))}
      </ul>
      <p className="slot-info">This slot loaded independently with its own data fetching.</p>
    </div>
  );
}

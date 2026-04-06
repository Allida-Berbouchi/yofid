export default function ModuleFilter({ modules, onSelect, }) {
    return (<select onChange={(e) => onSelect(e.target.value)} className="input-field" defaultValue="">
      <option value="">All Modules</option>
      {modules.map((mod) => (<option key={mod._id} value={mod._id}>
          {mod.title}
        </option>))}
    </select>);
}

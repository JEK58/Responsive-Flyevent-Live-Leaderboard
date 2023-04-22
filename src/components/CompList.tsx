import { CompList } from "../types/CompList";

interface Props {
  compList?: CompList;
}

export function ActiveCompList({ compList }: Props) {
  const activeComps = compList?.activeComps;

  return (
    <>
      <div className="m-10 text-lg ">
        {activeComps?.length && (
          <>
            <h2 className="text-2xl mb-2 font-bold">Active Comps:</h2>
            <ul>
              {activeComps.map((el) => (
                <li key={el.id}>
                  <a
                    className="dark:hover:text-slate-100 hover:text-red-800 underline"
                    href={`/?id=${el.id}`}
                  >
                    {el.name}
                  </a>
                </li>
              ))}
            </ul>
          </>
        )}

        {!activeComps?.length && "No active comps at the moment 😕"}
      </div>
    </>
  );
}

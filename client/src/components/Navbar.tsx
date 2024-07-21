import { LogoutButton } from "./LogoutButton";
import { ModeToggle } from "./mode-toggle";

const Navbar = () => {
  return (
    <ul className="flex items-center justify-end gap-5 p-4 border-b sticky z-10 top-0 backdrop-blur-md">
      <div className="flex gap-4 items-center justify-center">
        <li>
          <ModeToggle />
        </li>
        <li>
          <LogoutButton />
        </li>
      </div>
    </ul>
  );
};

export default Navbar;

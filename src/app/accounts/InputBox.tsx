type InputBoxProps = {
  id: string;
  value: string;
  name: string;
  onChange: (e: any, n: any) => void;
};

const InputBox: React.FC<InputBoxProps> = ({ id, value, name, onChange }) => (
  <div className="flex flex-col w-full space-y-2 text-[15.5px] leading-relaxed">
    <label className="block text-md font-medium text-gray-200 dark:text-textDarkmode">
      {name}
    </label>
    <input
      className="h-auto block w-full px-3 py-2 text-gray-900 border rounded-md shadow-md focus:ring-blue-500 focus:border-blue-500 sm:text-md"
      placeholder={name}
      value={value}
      onChange={(e) => onChange(id, e.target.value)}
    />
  </div>
);

export default InputBox;

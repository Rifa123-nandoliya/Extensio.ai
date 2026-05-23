import { useState } from "react";
import Sidebar from "../components/sidebar";
import Navbar from "../components/navbar";
import PromptBox from "../components/promptbox";
import ProjectCard from "../components/projectcard";
import { generateExtension } from "../api";
import { useEffect } from "react";
import { getProjects } from "../api";
import templates from "../data/templates";
import TemplateCard from "../components/templatecard";

function Dashboard() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [activePage, setActivePage] = useState("dashboard");
  const [search, setSearch] = useState("");
const [selectedCategory, setSelectedCategory] = useState("All");
  useEffect(() => {
  fetchProjects();
}, []);
const categories = [
  "All",
  "Productivity",
  "Appearance",
  "Entertainment",
  "Accessibility"
];
const filteredTemplates = templates.filter((template) => {

  const matchesSearch =
    template.title
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    selectedCategory === "All"
      ? true
      : template.category === selectedCategory;

  return matchesSearch && matchesCategory;
});
const useTemplate = (templatePrompt) => {
  setPrompt(templatePrompt);

  setActivePage("dashboard");
};

const fetchProjects = async () => {
  try {
    const result = await getProjects();

    setProjects(result.data);

  } catch (error) {
    console.error(error);
  }
};

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    try {
      setLoading(true);

      const result = await generateExtension(prompt);

      setProjects((prev) => [
        result.data,
        ...prev
      ]);

      setPrompt("");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex bg-gray-100 min-h-screen">

      <Sidebar
  activePage={activePage}
  setActivePage={setActivePage}
/>

      <div className="flex-1 p-8">

        <Navbar />

        <PromptBox
          prompt={prompt}
          setPrompt={setPrompt}
          handleGenerate={handleGenerate}
          loading={loading}
        />

        {activePage === "dashboard" && (
  <>
    <PromptBox
      prompt={prompt}
      setPrompt={setPrompt}
      handleGenerate={handleGenerate}
      loading={loading}
    />

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
        />
      ))}

    </div>
  </>
)}

{activePage === "extensions" && (
  <div>
    <h2 className="text-2xl font-bold mb-6">
      My Extensions
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          project={project}
        />
      ))}

    </div>
  </div>
)}

{activePage === "templates" && (
  <div>

  <div className="mb-8">

    <h2 className="text-3xl font-bold">
      Templates
    </h2>

    <p className="text-gray-500 mt-2">
      Start quickly using ready-made AI templates
    </p>

  </div>

  <div className="flex flex-col md:flex-row gap-4 mb-8">

    <input
      type="text"
      placeholder="Search templates..."
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="flex-1 border border-gray-300 rounded-xl px-4 py-3"
    />

    <select
      value={selectedCategory}
      onChange={(e) => setSelectedCategory(e.target.value)}
      className="border border-gray-300 rounded-xl px-4 py-3"
    >

      {categories.map((category) => (
        <option
          key={category}
          value={category}
        >
          {category}
        </option>
      ))}

    </select>

  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

    {filteredTemplates.map((template) => (
      <TemplateCard
        key={template.id}
        template={template}
        onUseTemplate={useTemplate}
      />
    ))}

  </div>

</div>
)}
{activePage === "settings" && (

  <div>

    <div className="mb-8">

      <h2 className="text-3xl font-bold">
        Settings
      </h2>

      <p className="text-gray-500 mt-2">
        Manage your Extensio.ai workspace
      </p>

    </div>

    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

      {/* Profile Card */}

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

        <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold mb-4">
          R
        </div>

        <h3 className="text-xl font-bold">
          Rifa
        </h3>

        <p className="text-gray-500 mt-1">
          AI Extension Developer
        </p>

        <button className="mt-5 bg-black text-white px-5 py-2 rounded-xl">
          Edit Profile
        </button>

      </div>

      {/* Workspace Settings */}

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

        <h3 className="text-xl font-bold mb-5">
          Workspace
        </h3>

        <div className="space-y-4">

          <div className="flex items-center justify-between">

            <span>Dark Mode</span>

            <button className="bg-gray-200 px-4 py-1 rounded-full">
              Off
            </button>

          </div>

          <div className="flex items-center justify-between">

            <span>Auto Save</span>

            <button className="bg-green-500 text-white px-4 py-1 rounded-full">
              On
            </button>

          </div>

          <div className="flex items-center justify-between">

            <span>AI Provider</span>

            <span className="font-semibold">
              Groq
            </span>

          </div>

        </div>

      </div>

      {/* Usage Stats */}

      <div className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">

        <h3 className="text-xl font-bold mb-5">
          Usage Stats
        </h3>

        <div className="space-y-5">

          <div>

            <p className="text-gray-500">
              Extensions Generated
            </p>

            <h4 className="text-3xl font-bold">
              {projects.length}
            </h4>

          </div>

          <div>

            <p className="text-gray-500">
              Templates Available
            </p>

            <h4 className="text-3xl font-bold">
              {templates.length}
            </h4>

          </div>

          <div>

            <p className="text-gray-500">
              Plan
            </p>

            <h4 className="text-2xl font-bold text-green-600">
              Free
            </h4>

          </div>

        </div>

      </div>

    </div>

  </div>
)}

      </div>

    </div>
  );
}

export default Dashboard;
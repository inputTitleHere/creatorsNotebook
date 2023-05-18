import ProjectImageInput from "./components/ProjectImageInput";
import ProjectTextInput from "./components/ProjectTextInput";
import "./projectCreate.scss";
/**
 * 신규 프로젝트를 생성하는 페이지이다.
 * 프로젝트 제목, 설명, 이미지를 Form으로 올린다.
 * 추가적으로 브릿지 생성을 위해 유저 번호를 같이 전달한다.
 * 프로젝트 생성과 동시에 유저-프로젝트 브릿지에 생성자를 등록한다.
 *
 */
export default function ProjectCreate() {
  const handleSubmit = async (event) => {
    // TODO -> 프로젝트 생성하기
    event.preventDefault();
  };

  return (
    <div className="create-project-wrapper">
      <h1>신규 프로젝트</h1>
      <div className="separate">
        <div className="liner">
          <div className="diagonal"></div>
        </div>
      </div>
        <form onSubmit={handleSubmit}>
          <div className="input-wrapper">
            <ProjectTextInput />
            <ProjectImageInput />
          </div>
        </form>
    </div>
  );
}

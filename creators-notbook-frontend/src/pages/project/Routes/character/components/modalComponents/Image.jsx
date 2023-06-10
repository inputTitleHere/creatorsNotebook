import {
  CancelRounded,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  Typography,
} from "@mui/material";
import { number, object } from "prop-types";
import { checkAuthority } from "../../../../../../utils/projectUtils";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import {
  removeEditTag,
  updateChracterAttr,
} from "../../../../../../redux-store/slices/characterSlice";
import { fetchByForm } from "../../../../../../utils/fetch";
import { IMAGE_DIRECTORY } from "../../../../../../utils/imageUtils";
import AttributeHandle from "./AttributeHandle";

Image.propTypes = {
  data: object,
  characterIndex: number,
};
export default function Image({ data, characterIndex }) {
  /* STATES */
  const [isEditMode, setIsEditMode] = useState(false);
  const [imageState, setImageState] = useState(null);
  const imageInputRef = useRef(null);
  const projectData = useSelector((state) => state.project.project);
  const character = useSelector((state) => state.character.characters)[
    characterIndex
  ];
  const dispatch = useDispatch();

  useEffect(() => {
    if (data.editMode) {
      setIsEditMode(true);
      imageInputRef.current.click();
      dispatch(removeEditTag({ characterIndex, name: data.name }));
    }
  }, [data, characterIndex, setIsEditMode, dispatch]);

  /* FUNCTION */

  /**
   * 영역 더블클릭시 수정모드로 전환
   */
  const handleDoubleClick = () => {
    if (!checkAuthority(projectData, 3)) {
      return false;
    }
    if (!isEditMode) {
      imageInputRef.current.focus();
      imageInputRef.current.click();
    }
    setIsEditMode(!isEditMode);
  };

  /**
   * 이미지 변경시 로컬에 반영함과 동시에 서버에 전송한다.
   */
  const handleImageChange = async () => {
    if (imageInputRef.current.files[0].size > 1024 * 1024 * 5) {
      alert("이미지는 5MB이하이여야 합니다!");
      imageInputRef.current.value = "";
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(imageInputRef.current.files[0]);
    reader.onload = () => {
      setImageState(reader.result);
      imageInputRef.current.value = "";
    };
    const result = await sendImageToServer();
    handleEditClose();
    console.log(result);
    if (!result.data) {
      alert("서버에 이미지 저장 실패");
      return;
    } else {
      dispatch(
        updateChracterAttr({
          characterIndex,
          name: data.name,
          value: result.data,
        })
      );
    }
  };

  /**
   * 신규 이미지를 서버에 전송한다.
   * @returns 신규 이미지 이름
   */
  const sendImageToServer = async () => {
    const prevData = character.data[data.name];

    const formData = new FormData();
    formData.append("previousData", JSON.stringify(prevData));
    formData.append("characterUuid", character.uuid);
    formData.append("image", imageInputRef.current.files[0]);
    return await fetchByForm("/character/saveImage", "POST", formData);
  };

  /**
   * 수정모드 해제
   */
  const handleEditClose = () => {
    setIsEditMode(false);
  };

  return (
    <Box
      sx={{
        display: "flex",
      }}
      onDoubleClick={handleDoubleClick}
    >
      <Box>
      {checkAuthority(projectData, 3) ? (
        <AttributeHandle
          characterUuid={character.uuid}
          characterIndex={characterIndex}
          name={data.name}
          type={data.type}
          value={data.value}
        />
      ) : (
        ""
      )}
      </Box>
      <Box display="flex" flexDirection="column" flexGrow="1">
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Typography variant="h6">{data.name}</Typography>
          <Box display="none">
            <input
              type="file"
              name="image"
              autoFocus
              onChange={handleImageChange}
              ref={imageInputRef}
            />
          </Box>
          {isEditMode && (
            <Box display="inline">
              <IconButton
                onClick={handleEditClose}
                sx={{ minHeight: 0, minWidth: 0, padding: 0 }}
              >
                <CancelRounded color="warning" fontSize="large" />
              </IconButton>
            </Box>
          )}
        </Box>
        <Box display="flex" justifyContent="flex-start">
          {imageState ? (
            <img
              src={imageState}
              alt="신규 이미지"
              style={{ maxWidth: "97%" }}
            />
          ) : (
            <img
              src={IMAGE_DIRECTORY + "\\" + data.value}
              alt="사용자 이미지"
              style={{ width: "97%" }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}

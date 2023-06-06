import {
  Box,
  Button,
  Container,
  Grid,
  Stack,
  Typography,
  keyframes,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { AddCircleOutline, ArrowBack, ArrowForward } from "@mui/icons-material";
import CharacterItem from "./components/CharacterItem";
import { useRef, useState } from "react";
import CharacterModal from "./components/CharacterModal";
import { fetchByForm } from "../../../../utils/fetch";
import {
  addCharacter,
  removeCharacter,
} from "../../../../redux-store/slices/characterSlice";

/**
 * 캐릭터 정보 표시 챕터
 */
export default function CharacterChapter() {
  /* HOOKS */
  const user = useSelector((state) => state.user.user);
  const project = useSelector((state) => state.project.project);
  const characterList = useSelector((state) => state.character.characters);
  const dispatch = useDispatch();

  /* STATES */
  const [isScrollAreaMouseHovered, setScrollAreaMouseHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCharacterChanged, setIsCharacterChanged]=useState(false);
  const [currentCharacterIndex, setCurrentCharacterIndex] = useState(undefined);
  const characterListRef = useRef(null);

  /* CONSTS */
  const slideLeft = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(-10px);
  }
  `;
  const slideRight = keyframes`
  from {
    transform: translateX(0);
  }
  to {
    transform: translateX(10px);
  }
  `;

  /* FUNCTION */
  //^ MODAL 관련
  /**
   * 변경내역을 저장하고 캐릭터 모달을 닫는다.
   */
  const handleModalClose = () => {
    if(isCharacterChanged){
      // TODO 
    }
    setIsModalOpen(false);
  };
  /**
   * 신규 캐릭터를 생성하고 서버로부터 발급받은 신규 캐릭터 정보를 프런트에 저장한 이후 모달을 연다.
   */
  const handleModalOpen = async () => {
    const formData = new FormData();
    formData.append("projectUuid", project.uuid);
    formData.append("userNo", user.no);
    const newCharacter = await fetchByForm("/character/new", "POST", formData);
    console.log(newCharacter);
    setCurrentCharacterIndex(characterList.length);
    dispatch(addCharacter(newCharacter));
    setIsModalOpen(true);
  };
  /**
   * 캐릭터를 삭제한다.
   * @param {string} uuid 캐릭터 고유 번호
   */
  const deleteCharacter = async (uuid, index) => {
    console.log("DELETE :" + uuid);
    const formData = new FormData();
    formData.append("characterUuid", uuid);
    formData.append("projectUuid", project.uuid);
    const result = await fetchByForm("/character/delete", "DELETE", formData);
    // --- 로컬 slice에서 삭제하기
    if (result) {
      setIsModalOpen(false);
      console.log(index);
      dispatch(removeCharacter(index));
    } else {
      alert("캐릭터 삭제 실패");
    }
  };

  //^ MODAL 관련 END
  /**
   * 세로방향의 스크롤을 캐릭터 리스트의 가로방향으로 변경한다.
   * @param {object} event 이벤트 객체
   */
  const handleHorizontalWheel = (event) => {
    characterListRef.current.scrollLeft += event.deltaY;
  };

  /**
   * 마우스가 스크롤 영역에 들어오면 작동한다.
   */
  const handleScrollAreaMouseEnter = () => {
    setScrollAreaMouseHovered(true);
  };
  /**
   * 마우스가 스크롤 영역에서 나가면 작동한다.
   */
  const handleScrollAreaMouseExit = () => {
    setScrollAreaMouseHovered(false);
  };

  return (
    <>
      <Container maxWidth={false} disableGutters={true}>
        {/* 캐릭터 챕터 상단 옵션바 */}
        <Box
          sx={{
            position: "absolute",
            background:
              "repeating-linear-gradient(-45deg,#ebe3787b 0px, #ebe3787b 10px, #302d1f7a 10px, #302d1f7a 20px)",
            width: "100vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onMouseEnter={handleScrollAreaMouseEnter}
          onMouseLeave={handleScrollAreaMouseExit}
          onWheel={handleHorizontalWheel}
        >
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            wrap="nowrap"
            sx={{
              padding: "10px",
              height: "3rem",
            }}
          >
            <Grid item>
              <Button
                variant="contained"
                startIcon={<AddCircleOutline />}
                onClick={handleModalOpen}
                sx={{
                  height: "2.5rem",
                  fontSize: "1.2rem",
                  padding: "1rem",
                }}
              >
                <Typography noWrap>신규 캐릭터 생성</Typography>{" "}
              </Button>
            </Grid>
            <Grid item>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "transparent.main",
                  padding: "0px 15px",
                  borderRadius: "15px",
                }}
              >
                <ArrowBack
                  sx={{
                    animation: isScrollAreaMouseHovered
                      ? `${slideLeft} .5s infinite alternate`
                      : "none",
                  }}
                />
                <Typography
                  variant="h6"
                  sx={{
                    margin: "0px 10px",
                    userSelect: "none",
                  }}
                >
                  스크롤 존
                </Typography>
                <ArrowForward
                  sx={{
                    animation: isScrollAreaMouseHovered
                      ? `${slideRight} .5s infinite alternate`
                      : "none",
                  }}
                />
              </Box>
            </Grid>
            <Grid item display="flex" alignItems="center" minWidth="150px">
              <Box
                sx={{
                  marginRight: "1rem",
                }}
              >
                <Typography noWrap>정렬옵션</Typography>
              </Box>
            </Grid>
          </Grid>
        </Box>
        {/* 캐릭터 표시 리스트 Box */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: "100vw",
            height: "calc(100vh - 3.5rem)",
            margin: "0px auto",
            overflowX: "scroll",
          }}
          ref={characterListRef}
        >
          <Stack direction="row" spacing={1} marginTop="3rem" paddingTop="5px">
            {characterList.map((item, index) => {
              return (
                <CharacterItem
                  data={item}
                  key={index}
                  index={index}
                  setters={{
                    setIsModalOpen,
                    setCurrentCharacterIndex,
                  }}
                />
              );
            })}
          </Stack>
        </Box>
        {isModalOpen && (
          <CharacterModal
            characterIndex={currentCharacterIndex}
            handleFunctions={{
              handleModalClose,
              deleteCharacter,
            }}
          />
        )}
      </Container>
    </>
  );
}

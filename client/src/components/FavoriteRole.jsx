import styled from "styled-components";
import { Text } from "./Styles/Text";
import { roleImg, roleName } from "../utility/favoriteRoleUtility";

const FavoriteRoleCont = styled.div`
  border-radius: 20px;
  border: solid 1px #00000019;
  grid-area: third;
  max-width: 400px;
  min-width: 350px;
`;

const TopCont = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const BotCont = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0px 0 0px 0px;
  width: 100%;

  @media screen and (max-width: 425px) {
    margin: 10px 0 0 10px;
  }
`;

const BotContText = styled.div`
  margin-left: 20px;
  width: 40%;
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 425px) {
    margin-left: 10px;
  }
`;

const RoleImg = styled.img`
  width: 45%;
`;

const RankTitle = styled(Text)`
  font-weight: 600;
  color: #000000c7;
  font-size: 24px;
  margin: 20px 0 0 20px;

  @media screen and (max-width: 425px) {
    font-size: 18px;
    margin: 10px 0 0 10px;
  }
`;

const RoleName = styled(Text)`
  font-weight: 600;
  color: #000000c7;
  font-size: 30px;
  white-space: nowrap;

  @media screen and (max-width: 500px) {
    font-size: 22px;
  }
`;

const RoleWinratio = styled(Text)`
  font-size: 16px;
  color: #000000c7;
`;

export const FavoriteRole = ({ playerData, matchesData }) => {
  const mainPlayer = matchesData.map((matchData) => {
    return matchData.info.participants.find(
      (participant) => participant.puuid === playerData.puuid
    );
  });

  const roles = mainPlayer.map((data) => {
    return data.teamPosition;
  });

  const mostFrequentRole = roles.reduce((prevRole, currRole) => {
    const count = roles.filter((role) => role === prevRole).length;
    return count < roles.filter((role) => role === currRole).length
      ? currRole
      : prevRole;
  }, null);

  const wins = mainPlayer.reduce((totalWins, data) => {
    if (data.teamPosition === mostFrequentRole && data.win) {
      return totalWins + 1;
    }
    return totalWins;
  }, 0);

  const losses = mainPlayer.reduce((totalLosses, data) => {
    if (data.teamPosition === mostFrequentRole && !data.win) {
      return totalLosses + 1;
    }
    return totalLosses;
  }, 0);

  const winRatio =
    mostFrequentRole && wins + losses !== 0
      ? ((wins / (wins + losses)) * 100).toFixed(0)
      : null;

  return (
    <FavoriteRoleCont>
      <TopCont>
        <RankTitle>Favourite role</RankTitle>
      </TopCont>
      <BotCont>
        <RoleImg src={roleImg(mostFrequentRole)} alt="" />
        <BotContText>
          <RoleName> {roleName(mostFrequentRole)}</RoleName>
          <RoleWinratio>
            {winRatio ? `Win Ratio ${winRatio}%` : null}
          </RoleWinratio>
        </BotContText>
      </BotCont>
    </FavoriteRoleCont>
  );
};

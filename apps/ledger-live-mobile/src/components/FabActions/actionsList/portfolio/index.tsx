import React, { useMemo } from "react";

import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { Icons } from "@ledgerhq/native-ui";

import { readOnlyModeEnabledSelector } from "../../../../reducers/settings";
import { ActionButton } from "../..";
import { NavigatorName, ScreenName } from "../../../../const";
import FabAccountButtonBar from "../account/FabAccountButtonBar";
import { accountsCountSelector } from "../../../../reducers/accounts";

const iconBuy = Icons.PlusMedium;
const iconSell = Icons.MinusMedium;
const iconSwap = Icons.BuyCryptoMedium;
const iconReceive = Icons.ArrowBottomMedium;
const iconSend = Icons.ArrowTopMedium;

type FabActionsProps = {
  areAccountsEmpty?: boolean;
};

export const FabPortfolioActions: React.FC<FabActionsProps> = ({
  areAccountsEmpty = false,
}) => {
  const { t } = useTranslation();
  const readOnlyModeEnabled = useSelector(readOnlyModeEnabledSelector);
  const accountsCount: number = useSelector(accountsCountSelector);
  const hasAccounts = accountsCount > 0;

  const actions = useMemo<ActionButton[]>(() => {
    const actionButtonBuy: ActionButton = {
      event: "TransferExchange",
      label: t("exchange.buy.tabTitle"),
      Icon: iconBuy,
      navigationParams: [
        NavigatorName.Exchange,
        {
          screen: ScreenName.ExchangeBuy,
        },
      ],
    };

    const actionButtonSell: ActionButton = {
      event: "TransferExchange",
      label: t("exchange.sell.tabTitle"),
      Icon: iconSell,
      navigationParams: [
        NavigatorName.Exchange,
        {
          screen: ScreenName.ExchangeSell,
        },
      ],
    };

    const actionButtonTransferSwap: ActionButton = {
      event: "TransferSwap",
      label: t("transfer.swap.title"),
      Icon: iconSwap,
      navigationParams: [
        NavigatorName.Swap,
        {
          screen: ScreenName.Swap,
        },
      ],
    };

    const actionButtonTransferReceive: ActionButton = {
      event: "TransferReceive",
      label: t("transfer.receive.title"),
      Icon: iconReceive,
      navigationParams: [
        NavigatorName.ReceiveFunds,
        {
          screen: ScreenName.ReceiveSelectCrypto,
        },
      ],
    };

    const actionButtonTransferSend: ActionButton = {
      event: "TransferSend",
      label: t("transfer.send.title"),
      Icon: iconSend,
      navigationParams: [
        NavigatorName.SendFunds,
        {
          screen: ScreenName.SendCoin,
        },
      ],
      disabled: areAccountsEmpty,
    };

    return [
      ...(hasAccounts && !readOnlyModeEnabled
        ? [actionButtonTransferSwap]
        : []),
      actionButtonBuy,
      actionButtonSell,
      ...(hasAccounts && !readOnlyModeEnabled
        ? [actionButtonTransferReceive, actionButtonTransferSend]
        : []),
    ];
  }, [hasAccounts, readOnlyModeEnabled, t, areAccountsEmpty]);

  return <FabAccountButtonBar buttons={actions} />;
};

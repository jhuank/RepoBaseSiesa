
export interface ISocialNetwork {
    title?: string;
    link?: string;
    alt?: string;
    show?: boolean;
}

export interface ICompany {
    config?: {
        debug?: boolean;
        showLegalAdvice?: boolean;
        redirectToB2bPage?: boolean;
        quantity_validate?: boolean;
        mostrarModalConfirmaciónMayorEdad?: boolean;
        crearDireccionModalCobertura?: boolean;
        data?: {
            item?: {
                showComments?: boolean;
                showItemsPriceFilter?: boolean;
                internetPriceString?: string;
                internetEndPriceString?: string;
                annexedDocumentString?: string;
                getMoreSelledProducts?: boolean;
                getNewProducts?: boolean;
                getJoyasDeLaCasaProducts?: boolean;
                placeholderSearchProduct?: string;
                paginationPerPage?: number;
            };
            shipping?: {
                fastSearch?: boolean;
                showPointsOfSale?: boolean;
                showShippingMethod?: boolean;
                showBannerShippingMethod?: boolean;
            };
            cart?: {
                cartBuyText?: string;
                showOrderComment?: boolean;
                maxlengthOrderComment?: number;
                showDiscountCoupon?: boolean;
                showTransportPrice?: boolean;
                showPdfButton?: boolean;
                showPremessageOrder?: boolean;
                showSelectPriceList?: boolean;
                showFooterCartBanner?: boolean;
                showCartetera?: boolean;
                validationLiquidationCartTransport?: boolean;
                messageValidationLiquidationCartTransport?: string;
                showCartWeight?: boolean;
                enablePaymentForCoverage?: boolean;
            };
            tunnel?: {
                showContactProgrammedDelivery?: boolean;
                hasGangway?: boolean;
                allowQuotesNoLogin?: boolean;
                showLabelSavingIva?: boolean;
                labelSavingIva?: string;
            };
            banners?: {
                showNews?: boolean;
            };
            categories?: {
                menuType?: number
                textOurProducts?: string;
            };
            cartera?: {
                carteraPorSucursal?: boolean;
            };
            register?: {
                automaticLogin?: boolean;
                allowRegister?: boolean;
                typeCalendarRegister?: number;
                ocultarFechaNocimientoRegistro?: number;
                showContactAlternateNumber?: boolean; 
            };
            home?: {
                titleFeatured2?: string;
                promotions_activate?: number;
                use_featured_by_category?: number;
                featured_by_category?: any[]
            };
            productSheet?: {
                showImageAndPriceProductComplement?: boolean;
                showImageAndPriceProductSubstitute?: boolean;
            };
        };
        header?: {
            showIcons?: boolean;
            show_account_in_header?: boolean;
            showBlog?: boolean;
            showEvent?: boolean;
            selectBranch?: boolean;
            show_cart_in_header?: boolean;
            showCategories?: boolean;
            showKnowUs?: boolean;
            showOfferts?: boolean;
            showContact?: boolean;
            showBranchOffice: boolean;
            show_tab_right?: boolean;
            pay_zone?: {
                pay_zone_and_advances?: boolean;
                only_pay_zone?: boolean;
                only_advances?: boolean;
                only_payments?: boolean;
            };
            logout?: {
                state_lost_session?: string;
            };
            fastLoad?: {
                showFastLoad?: boolean;
            };
        };
        pay_zone?: {
            home_url?: string;
            payments_url?: string;
        };
        login?: {
            text_welcome_withow_branch?: string;
            text_welcome_with_branch?: string;
        };
        dashboard?: {
            showSummary?: boolean;
            showMyOrders?: boolean;
            showMyQuotes?: boolean;
            showMyAccount?: boolean;
            showSelectClient?: boolean;
        };
        orders?: {
            duplicateOrders?: boolean;
            paySavedOrders?: boolean;
            mostrarFechaEntregaProgramada?: boolean;
        };
        menu?: {
            showPqrs?: boolean;
            showConsults?: boolean;
            showCoorporateDemoMenu?: boolean;
            showSearchJob?: boolean;
            showSearchInsideMenu?: boolean;
            showFastLoadInHeader?: boolean;
            showFastLoadInFooter?: boolean;
            showFastLoadAlways?: boolean;
            fastLoadText?: string;
            presentacionNombresCategoriasMenu?: number;
        },
        toast?:{
          tiempoVisualizacionAlertasCanasta?:number
        };
    };
    app?: {
        clientName?: string;
        url?: string;
        title?: string;
        description?: string;
        header?: {
            showContactInfo?: boolean;
            placeholder?: string;
            logo?: {
                src?: string;
                url?: string;
                url_url?: string;
                title?: string;
                alt?: string;
                width?: string;
                height?: string;
                logo_front?: string;
            };
            data?: any[];
        };
        pages?: {
            corporate?: {
                link?: {
                    url?: string;
                    title?: string;
                };
            };
        };
        footer?: {
            menu?: {
                contactUrl?: string;
            };
            info?: {
                title?: string;
                description?: string;
                date?: string;
            };
            logo?: {
                src?: string;
                title?: string;
                alt?: string;
                width?: string;
                height?: string;
            };
            showNewsletterForm?: boolean;
            data?: any[];
        };
    };
    info?: {
        company?: {
            validaIndicativoRegistro: boolean;
            validaIndicativoContacto: boolean;
            SolicitarBarrioRegistro: any;
            name?: string;
            nit?: string;
            webpage?: string;
            address?: string;
            pbx?: string;
            phone?: string;
            phone3?: string;
            cell?: string;
            email?: string;
            location?: string;
            user_twitter?: string;
            titlePage?: string;
            favicon?: string;
        };
        style?: {
            mainColor?: string;
            secondColor?: string;
        };
        social?: {
            facebook?: ISocialNetwork;
            google?: ISocialNetwork;
            youtube?: ISocialNetwork;
            twitter?: ISocialNetwork;
            pinterest?: ISocialNetwork;
            linkedin?: ISocialNetwork;
            instagram?: ISocialNetwork;
        }
        recaptcha?: {
            id?: string;
        }
    }
}

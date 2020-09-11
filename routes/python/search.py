import sys
import re

textFile = "exampleText.txt"
logFile = "foundLog.txt"

keywords = {    #list of regex commands ment to seach for items
                "courseDes":      ["course description"] ,
                "courseObj":      [] ,
                "courseCred":     [] ,
                "preReq":         [] ,
                "gradeDet":       ["grading:"] ,
                "otherpolicies":  [] ,
                "instrName":      [] ,
                "instrContact":   [" (.)*" , "contact:" , "e(-| )mail:"] ,
                "democonsistant": [] , # not sure if this can be checked with keywords
                "assesMethod":    [] ,
                "rubrics":        [] , # may be missing
                "biblio":         [] ,
                "assignments":    ["assignments" , "bee"] ,
                "taskCrit":       [] ,
                "courseNum":      ["[0-9]{3}( )*(N|L|n|l)( )*[0-9]{3}" , "course( )*number" , "class( )*number" , "[0-9]{3}( )*(N|L|n|l)"] ,
                "format":         [] ,
                "attenPol":       [] ,
                "reqRead":        [] ,
                "courseDes":      [] ,
                "acadHonest":     [] ,
                "teachAct":       [] ,
                "accommod":       [] ,
                "courseDes":      [] ,
                "diversity":      [] , # not technically req
            }

found = {   #empty dictionary of arrays to store any matches to analyize later
            "courseDes":      [] ,
            "courseObj":      [] ,
            "courseCred":     [] ,
            "preReq":         [] ,
            "gradeDet":       [] ,
            "otherpolicies":  [] ,
            "instrName":      [] ,
            "instrContact":   [] ,
            "democonsistant": [] , # not sure if this can be checked with keywords
            "assesMethod":    [] ,
            "rubrics":        [] , # may be missing
            "biblio":         [] ,
            "assignments":    [] ,
            "taskCrit":       [] ,
            "courseNum":      [] ,
            "format":         [] ,
            "attenPol":       [] ,
            "reqRead":        [] ,
            "courseDes":      [] ,
            "acadHonest":     [] ,
            "teachAct":       [] ,
            "accommod":       [] ,
            "courseDes":      [] ,
            "diversity":      [] , # not technically req
        }

def checkFileAnal():
    print("checking file...")
    print(keywords["courseDes"][1])

    o = open(logFile, "a")
    o.write("\n\nOutput for " + "textFile") #text file will be the sylibus being evaluated

    s = open(textFile , "r")

    for key in keywords: #loops through entire dictionary
        o.write("\nResults for " + key)
        for line in s: #loops through each line of sylibus
            print(keywords[key])
            for i in keywords[key]: #loops through each regex search
                print("loop")
                result = re.search(keywords[key][i] , line) #searches line for regex command
                if(result != "none"):
                    print(result)
                    found[key] = result
                    o.write("Match to " + keywords[key][i] + " in line " + line + ": " + result + "\n")

    return found

def checkFileFast():
    found = len()

    f = open(textFile , "r")
    for i in keywords:
        for line in f:
            if keywords[i] in line:
                found[i] = line

    return found

checkFileAnal()
